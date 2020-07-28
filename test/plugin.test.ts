import plugin from '../src';
import pluginTester from 'babel-plugin-tester';

const codeToBeChanged = `
import React from "react";
import RichText from "vtex.store-components/RichText";

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
);

HelloWorld.displayName = 'hello-world';

HelloWorld.schema = {
  title: 'Hello World',
  properties: {
    text: {
      title: "Text",
      type: "string",
    },
    alignment: {
      title: "Alignment",
      type: "string",
    }
  }
}

export default HelloWorld;`;

const expectedTransformedCode = `
import React from 'react';
import RichText from 'vtex.store-components/RichText';

const HelloWorld = () => (
  <div>
    <RichText
      textAlignment="CENTER"
      textPosition="CENTER"
      text="# Hello, World!"
    />
  </div>
);

export default HelloWorld;`;

const codeThatShouldNotChange = `
  import React from 'react';
  import RichText from 'vtex.store-components/RichText';

  const HelloWorld = () => (
    <div>
      <RichText
        textAlignment="CENTER"
        textPosition="CENTER"
        text="# Hello, World!"
      />
    </div>
  );

  HelloWorld.notADisplayName = 'hello-world';
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
  };
  export default HelloWorld;`;

pluginTester({
  plugin: plugin,
  pluginName: 'babel-plugin-vtex-cms',
  snapshot: false,
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx'],
  },
  tests: {
    'Removes .schema and .displayName assignments from input code': {
      code: codeToBeChanged,
      output: expectedTransformedCode,
    },
    "Does not change code that doesn't contain .schema and .displayName assignments": codeThatShouldNotChange,
  },
});
