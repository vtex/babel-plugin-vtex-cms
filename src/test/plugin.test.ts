import pluginTester from 'babel-plugin-tester'

import plugin from '..'

const codeToBeChanged = `
import React from 'react'
import RichText from 'vtex.store-components/RichText'

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
)

HelloWorld.displayName = 'hello-world'

HelloWorld.schema = {
  title: 'Hello World',
  properties: {
    text: {
      title: 'Text',
      type: 'string',
    },
    alignment: {
      title: 'Alignment',
      type: 'string',
    },
  },
}

export default HelloWorld
`

const expectedTransformedCode = `
import React from 'react'
import RichText from 'vtex.store-components/RichText'

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
)

HelloWorld.schema = {
  title: 'Hello World',
}
export default HelloWorld
`

const codeThatShouldNotChange = `
import React from 'react'
import RichText from 'vtex.store-components/RichText'

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
)

HelloWorld.notADisplayName = 'hello-world'
HelloWorld.notASchema = {
  title: 'Hello World',
  properties: {
    text: {
      title: 'Text',
      type: 'string',
    },
    alignment: {
      title: 'Alignment',
      type: 'string',
    },
  },
}
export default HelloWorld
`

const typeScriptCodeToBeChanged = `
import React, { FC } from 'react'
import RichText from 'vtex.store-components/RichText'

interface Props {
  text: string
}

const HelloWorld: FC<Props> = ({ text }) => (
  <div className="flex">
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text={text}
    />
  </div>
)

HelloWorld.displayName = 'hello-world'

HelloWorld.schema = {
  title: 'Hello World',
  properties: {
    text: {
      title: 'Text',
      type: 'string',
    },
    alignment: {
      title: 'Alignment',
      type: 'string',
    },
  },
}

export default HelloWorld
`

const expectedTypeScriptTransformedCode = `
import React from 'react'
import RichText from 'vtex.store-components/RichText'

const HelloWorld = ({ text }) => (
  <div className="flex">
    <RichText textAlignment="CENTER" textPosition="CENTER" text={text} />
  </div>
)

HelloWorld.schema = {
  title: 'Hello World',
}
export default HelloWorld
`

const codeWithInvalidSchema = `
import React from 'react'
import RichText from 'vtex.store-components/RichText'

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
)

HelloWorld.displayName = 'hello-world'

HelloWorld.schema = {
  properties: {
    text: string,
    alignment: {
      title: 'Alignment',
      type: 'string',
    },
  },
}

export default HelloWorld
`

pluginTester({
  plugin,
  pluginName: 'babel-plugin-vtex-cms',
  babelOptions: {
    filename: 'test.tsx',
    plugins: ['@babel/plugin-syntax-jsx'],
    presets: ['@babel/preset-typescript'],
  },
  tests: {
    'Removes .displayName assignments from input code and leaves only title property in schema': {
      code: codeToBeChanged,
      output: expectedTransformedCode,
    },
    "Does not change code that doesn't contain .schema and .displayName assignments": codeThatShouldNotChange,
    'Works with TypeScript code': {
      code: typeScriptCodeToBeChanged,
      output: expectedTypeScriptTransformedCode,
    },
    'Should thrown if an invalid schema is found (no title)': {
      code: codeWithInvalidSchema,
      error:
        'Found a .schema definition with no title. Please add a title to your schema.',
    },
  },
})
