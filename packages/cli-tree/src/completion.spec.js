/* eslint-env jest */
const { findCommand, getCommandCompletion } = require('./completion')

describe('Completion', () => {
  describe('getCommandCompletion', () => {
    it('gets sub commands for a command with sub commands', () => {
      expect(
        getCommandCompletion({
          description: 'the description',
          subcommand1: {},
          subcommand2: {}
        })
      ).toEqual(['subcommand1', 'subcommand2'])
    })
    it('gets options for a command without sub commands', () => {
      expect(
        getCommandCompletion({
          description: 'the description',
          arguments: [{ argument: '--option1' }, { argument: '--option2' }]
        })
      ).toEqual(['--option1', '--option2'])
    })
    it('gets options for a command without sub commands and filters out positionnal parameters', () => {
      expect(
        getCommandCompletion({
          description: 'the description',
          arguments: [
            { argument: '--option1' },
            { argument: 'param1' },
            { argument: '--option2' }
          ]
        })
      ).toEqual(['--option1', '--option2'])
    })
    it('gets options for a command with array arguments', () => {
      expect(
        getCommandCompletion({
          description: 'the description',
          arguments: [
            { argument: ['--option1', '-o'] },
            { argument: ['--option2'] }
          ]
        })
      ).toEqual(['--option1', '-o', '--option2'])
    })
  })
  describe('findCommand', () => {
    const commands = {
      conrad: {
        description: 'conrad command',
        deploy: { description: 'deploy command' },
        jobs: {
          description: 'jobs command',
          refresh: {
            description: 'jobs refresh command'
          }
        }
      }
    }
    it('finds main command', async () => {
      expect(findCommand(commands, 'conrad')).toMatchObject({
        description: 'conrad command'
      })
    })
    it('finds main command with options', async () => {
      expect(findCommand(commands, 'conrad --coucou -t')).toMatchObject({
        description: 'conrad command'
      })
    })
    it('finds sub command', async () => {
      expect(findCommand(commands, 'conrad deploy')).toMatchObject({
        description: 'deploy command'
      })
    })
    it('finds sub command with options', async () => {
      expect(findCommand(commands, 'conrad --env jobs -v')).toMatchObject({
        description: 'jobs command'
      })
    })
    it('finds sub command with value options', async () => {
      expect(findCommand(commands, 'conrad --env=prod jobs -v')).toMatchObject({
        description: 'jobs command'
      })
    })
  })
})
