/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/*
 * @Author: zhupengfei
 * @Date: 2021-09-08 15:07:05
 * @LastEditTime: 2021-09-13 18:04:41
 * @LastEditors: zhupengfei
 * @Description:
 * @FilePath: /cocos-build/src/main.ts
 */
import * as core from '@actions/core'
import axios from 'axios'
import {exec} from '@actions/exec'

// import {wait} from './wait'

type CCDownloadType = {version: string; darwin: string; win32: string}

async function run(): Promise<void> {
  try {
    const cocosVersion = core.getInput('cocos-version')
    core.debug(`cocos-version->: ${cocosVersion}`)
    console.log('cocosVersion :>> ', cocosVersion)

    const projectPath = core.getInput('project-path')
    core.debug(`project-path->: ${projectPath}`)
    console.log('projectPath :>> ', projectPath)

    try {
      const response = await axios.get(
        'https://creator-api.cocos.com/api/cocoshub/editor_version_list?lang=zh'
      )
      const {data} = response.data
      const ccDownloadItem = (data['2d'] as CCDownloadType[]).find(value => {
        return value.version === cocosVersion
      })
      const dlUrl = ccDownloadItem?.darwin
      console.log('dlUrl :>> ', dlUrl)
      await exec(`echo 'download start'`)
      await exec(`wget ${dlUrl} -O CocosCreator_V${cocosVersion}.zip`)
      await exec(`echo 'download end'`)
      await exec(`echo 'unzip start'`)
      await exec(`unzip CocosCreator_V${cocosVersion}.zip`)
      await exec(`echo 'unzip end'`)
      await exec(`echo 'open app start'`)
      await exec(`open CocosCreator.app`)
      await exec(`echo 'open app end'`)
      // shell.exec(`wget ${dlUrl} -O CocosCreator_V${'2.4.2'}.zip`)
      // shell.exec(`unzip CocosCreator_V${'2.4.2'}.zip`)
      // shell.exec(`open CocosCreator.app`)
      // shell.exec(
      //   `./CocosCreator.app/Contents/MacOS/CocosCreator --path ./ --build`
      // )
    } catch (error) {
      core.error(error as string)
    }

    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())
    // core.setOutput('time', new Date().toTimeString())
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
