import plugin from '../src';
import { transformSync } from '@babel/core';

const exampleWithAssignments = `
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

const exampleWithoutAssignments = `
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

HelloWorld.notADisplayName = 'hello-world';

HelloWorld.notASchema = {
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

it('should remove .schema and .displayName assignments from JSX code', () => {
  const tranformResult = transformSync(exampleWithAssignments, {
    plugins: [plugin, '@babel/plugin-syntax-jsx'],
  });
  expect(tranformResult?.code).toMatchSnapshot();
});

it('should not change code if no .schema or .displayName assignments are found', () => {
  const tranformResult = transformSync(exampleWithoutAssignments, {
    plugins: [plugin, '@babel/plugin-syntax-jsx'],
  });
  expect(tranformResult?.code).toMatchSnapshot();
});
