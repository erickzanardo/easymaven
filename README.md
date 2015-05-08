# easymaven

Cli tool to simplify the dependency adding for maven projects

## Install it

```
npm install easymaven --save
```

## Use it

On a maven project root folder (that contains a pom.xml file) execute

```
easymaven gson
```

This will add gson to your dependencies, if your pom already has gson on it's dependency, easymaven will just update this depency version
