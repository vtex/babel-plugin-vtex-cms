import plugin from '../src';
import { transformSync } from '@babel/core';

const example = `
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

export default HelloWorld;
`;

it('works', () => {
  const tranformResult = transformSync(example, {
    plugins: [plugin, '@babel/plugin-syntax-jsx'],
  });
  expect(tranformResult?.code).toMatchSnapshot();
});
