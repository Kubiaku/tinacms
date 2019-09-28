import { TinaCMS } from './tina-cms'

// Screen Plugins
import { MediaView, SettingsView } from './plugins/screens'

// Field Plugins
import TextFieldPlugin from './plugins/fields/TextFieldPlugin'
import TextareaFieldPlugin from './plugins/fields/TextareaFieldPlugin'
import DateFieldPlugin from './plugins/fields/DateFieldPlugin'
import ImageFieldPlugin from './plugins/fields/ImageFieldPlugin'
import ColorFieldPlugin from './plugins/fields/ColorFieldPlugin'
import ToggleFieldPlugin from './plugins/fields/ToggleFieldPlugin'
import MarkdownFieldPlugin from './plugins/fields/MarkdownFieldPlugin'
import GroupFieldPlugin from './plugins/fields/GroupFieldPlugin'
import GroupListFieldPlugin from './plugins/fields/GroupListFieldPlugin'
import BlocksFieldPlugin from './plugins/fields/BlocksFieldPlugin'

export const cms = new TinaCMS()

cms.screens.add(MediaView)
cms.screens.add(SettingsView)

cms.fields.add(TextFieldPlugin)
cms.fields.add(TextareaFieldPlugin)
cms.fields.add(DateFieldPlugin)
cms.fields.add(ImageFieldPlugin)
cms.fields.add(ColorFieldPlugin)
cms.fields.add(ToggleFieldPlugin)
cms.fields.add(MarkdownFieldPlugin)
cms.fields.add(GroupFieldPlugin)
cms.fields.add(GroupListFieldPlugin)
cms.fields.add(BlocksFieldPlugin)
