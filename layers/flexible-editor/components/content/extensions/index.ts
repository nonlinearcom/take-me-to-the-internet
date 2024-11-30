import { Blockquote } from './Blockquote'
import { Bold } from './Bold'
import { BulletList } from './BulletList'
import { Code } from './Code'
import { CodeBlock } from './CodeBlock'
import { Document } from './Document'
import { HardBreak } from './HardBreak'
import { Heading } from './Heading'
import { HorizontalRule } from './HorizontalRule'
import { Italic } from './Italic'
import { Link } from './Link'
import { ListItem } from './ListItem'
import { OrderedList } from './OrderedList'
import { Paragraph } from './Paragraph'
import { Strike } from './Strike'
import { Subscript } from './Subscript'
import { Superscript } from './Superscript'
// import { Table } from '@tiptap/extension-table'
// import { TableCell } from '@tiptap/extension-table-cell'
// import { TableHeader } from '@tiptap/extension-table-header'
// import { TableRow } from '@tiptap/extension-table-row'
import { Text } from './Text'
import { TextAlign } from './TextAlign'

export default [
  Document,
  Text,
  Paragraph,
  HardBreak,
  Heading,
  CodeBlock,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HorizontalRule,
  Link,
  Bold,
  Italic,
  Strike,
  Code,
  Subscript,
  Superscript,
  // Table,
  // TableHeader,
  // TableRow,
  // TableCell,
  TextAlign,
]
