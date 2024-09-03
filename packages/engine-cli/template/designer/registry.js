/**
 * Copyright (c) 2024 - present TinyEngine Authors.
 * Copyright (c) 2024 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

import {
  Breadcrumb,
  Fullscreen,
  Lang,
  Lock,
  Logo,
  Media,
  Redoundo,
  Save,
  Clean,
  Preview,
  GenerateCode,
  Refresh,
  Collaboration,
  Setting,
  Materials,
  State,
  Script,
  Tree,
  Help,
  Schema,
  Page,
  I18n,
  Bridge,
  Block,
  Datasource,
  Robot,
  Props,
  Events,
  Styles,
  Layout,
  Canvas,
  EditorInfoService,
  AppService,
  GenerateCodeService
} from '@opentiny/tiny-engine'
import engineConfig from './engine.config'

export default {
  root: {
    id: 'engine.root',
    metas: [EditorInfoService, AppService, GenerateCodeService]
  },
  config: engineConfig,
  layout: Layout,
  themes: [
    {
      id: 'engine.theme.light'
    },
    {
      id: 'engine.theme.dark'
    }
  ],
  toolbars: [
    Logo,
    Breadcrumb,
    Media,
    Collaboration,
    Clean,
    Refresh,
    Save,
    GenerateCode,
    Preview,
    Redoundo,
    Fullscreen,
    Lock,
    Setting,
    Lang
  ],
  plugins: [Materials, Tree, Page, Block, Datasource, Bridge, I18n, Script, State, Schema, Help, Robot],
  dsls: [{ id: 'engine.dsls.dslvue' }],
  settings: [Props, Styles, Events],
  canvas: Canvas
}
