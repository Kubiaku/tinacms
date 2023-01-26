/**
Copyright 2021 Forestry.io Holdings, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ManyLevelGuest } from 'many-level'
import { pipeline } from 'readable-stream'
import { connect } from 'net'

export class TinaLevelClient extends ManyLevelGuest<
  string,
  Record<string, any>
> {
  private _connected = false
  public openConnection() {
    if (this._connected) return
    const socket = connect(9000)
    pipeline(socket, this.createRpcStream(), socket, () => {
      // Disconnected
      this._connected = false
    })
    this._connected = true
  }
}
export interface Bridge {
  rootPath: string
  glob(pattern: string, extension: string): Promise<string[]>
  get(filepath: string): Promise<string>
  put(filepath: string, data: string): Promise<void>
  delete(filepath: string): Promise<void>
  /**
   * Whether this bridge supports the ability to build the schema.
   */
  supportsBuilding(): boolean
  putConfig(filepath: string, data: string): Promise<void>
  /**
   * Optionally, the bridge can perform
   * operations in a separate path.
   */
  outputPath?: string
  addOutputPath?(outputPath: string): void
}