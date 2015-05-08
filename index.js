var request = require('request')
  , cheerio = require('cheerio')
  , readline = require('readline')
  , fs = require('fs');

module.exports = function(pomPath, artifact) {
  var searchPath = ['http://search.maven.org/solrsearch/select?q=a:%22', artifact, '%22&wt=json'].join('');
  request(searchPath, function(err, response, body) {
    if(err) throw err;
    var data = JSON.parse(body);
    var count = data.response.numFound;
    console.log('Artifacts found: ' + count);
    if(count > 0) {
      var i = 0;
      data.response.docs.forEach(function(doc) {
        console.log([
          i,
          doc.g,
          doc.a,
          doc.latestVersion
        ].join(':'));
        i++;
      });
      var rl = readline.createInterface(process.stdin, process.stdout);
      rl.setPrompt('Choose a number: ');
      rl.prompt();
      rl.on('line', function(line) {
        var index = parseInt(line);
        if (!isNaN(index) && data.response.docs[index]) {
          var doc = data.response.docs[index];
          fs.readFile(pomPath, 'utf8', function(err, pomData) {
            $ = cheerio.load(pomData, {
              xmlMode: true
            });
            var artifactId = doc.a;
            var groupId = doc.g;
            var version = doc.latestVersion;

            var dependencies = $('dependencies');
            if(!dependencies.length) {
              $.append('<dependencies></dependencies>');
              dependencies = $('dependencies');
            }

            if($('artifactId:contains("' + artifactId + '")').length) {
              console.log('artifact ' + artifactId + ' found on pom.xm, updating version ');
              var dependency =  $('artifactId:contains("' + artifactId + '")').parent();
              dependency.find('version').text(version);
            } else {
              console.log('Adding dependency to pom');
              var dependency = [
                '     <dependency>',
                '         <groupId>', groupId, '</groupId>',
                '         <artifactId>', artifactId, '</artifactId>',
                '         <version>', version, '</version>',
                '     </dependency>\n\r'
              ].join('\n');
              dependencies.append(dependency);
            }

            fs.writeFile(pomPath, $.html(), 'utf8', function(err) {
              if(err) throw err;
              rl.close();
           });
          });
        } else {
          rl.prompt();
        }
       }).on('close',function(){
          process.exit(0);
      });
   }
  });
}
