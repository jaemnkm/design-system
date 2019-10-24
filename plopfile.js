module.exports = function(plop) {
  // create your generators here

  plop.setGenerator('core', {
    description: 'Create new core component',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Please enter component name (ProperCase)'
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'packages/core/src/{{componentName}}.js',
        templateFile: 'plop-templates/core-component/Component.js.hbs'
      },
      {
        type: 'add',
        path: 'packages/core/test/{{componentName}}.js',
        templateFile: 'plop-templates/core-component/Test.js.hbs'
      },
      {
        type: 'add',
        path: 'packages/core/storybook/{{componentName}}.js',
        templateFile: 'plop-templates/core-component/Story.js.hbs'
      }
    ] // array of actions
  })

  plop.setGenerator('sub', {
    description: 'Create new sub-module',
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
