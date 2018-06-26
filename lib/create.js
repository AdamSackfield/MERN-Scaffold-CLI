const prompt = require('prompt')
const shell = require('shelljs')
const fs = require('fs')
const colors = require('colors')
const inquirer = require('inquirer')

prompt.message = colors.green('Replace')

module.exports = (args, options, logger) => {
  const variant = options.variant || 'default'
  const templatePath = `${__dirname}/../templates/${args.template}/${variant}`
  const localPath = process.cwd()

  if(fs.existsSync(templatePath)) {
    logger.info('Copying files...')
    shell.cp('-R', `${templatePath}/*`, localPath)
    shell.cp('-R', `${templatePath}/.env`, localPath)
    logger.info('Copying complete')
  } else {
      logger.error(`The requested template "${args.template}" wasn't found`)
      process.exit(1)
  }

  const variables = require(`${templatePath}/_variables`)
  const initialQuestion = [
    { type: 'confirm', name: 'customModel', message: 'Custom Model Fields?' }
  ]
  const customQuestions = [
    { type: 'input', name: 'appName', message: 'App Name' },
    { type: 'input', name: 'appDescription', message: 'App Description' },
    { type: 'input', name: 'databaseName', message: 'Database Name' },
    { type: 'input', name: 'modelName', message: 'Model Name' },
    { 
      type: 'checkbox', 
      name: 'modelFields', 
      message: 'Select the model fields', 
      choices: ["firstName", "lastName", "userName", "email", "address", "phoneNumber", "hashedPassword", "birthDate"] 
    }
  ]

  const unselectedChoices = ["firstName", "lastName", "userName", "email", "address", "phoneNumber", "hashedPassword", "birthDate"] 

  if(fs.existsSync(`${localPath}/_variables.js`)) {
    shell.rm((`${localPath}/_variables.js`))
  }

  logger.info('Please fill in the following values...')

  inquirer.prompt(initialQuestion).then(answer => {
    if(answer.customModel === true) {
      inquirer.prompt(customQuestions).then(answers => {
        
      
        shell.ls('-RlA', '.').forEach(entry => {
          logger.info('Creating Model...')
          if(entry.isFile()) {
            answers.modelFields.map(field => {
              let index = unselectedChoices.indexOf(field)
              if(index !== -1) {
                unselectedChoices.splice(index, 1)
              }

              shell.sed('-i', `\\[${field.toUpperCase()}\\]`, field, entry.name)

              unselectedChoices.map(target => {
                console.log('Target', target)
                console.log('TargetUC', target.toUpperCase())

                shell.exec(`sed "/[${target.toUpperCase()}]/,/}/d"`, entry.name)
              })
            })

            logger.info('Inserting Variables')
            const variables = ['appName', 'appDescription', 'databaseName', 'modelName']
            variables.map(variable => {
              shell.sed('-i', `\\[${variable.toUpperCase()}\\]`, answers[variable], entry.name)
            })
          }
        })

      })
    } else {
      logger.error('ERROR')
    }
  })
}