module.exports = function(plop) {
  // create your generators here
  plop.setGenerator('component', {
    description: 'React component',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Please enter component name (ProperCase)'
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'addMany',
        base: 'plop-templates/sub-component',
        destination: 'packages/{{kebabCase componentName}}',
        path: '{{componentName}}.js',
        templateFiles: 'plop-templates/sub-component/**',
        stripExtensions: ['hbs']
      }
    ] // array of actions
  })
}
