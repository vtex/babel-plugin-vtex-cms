import generateInterface from '../src/interfaceGenerator';

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

describe('Generating an interfaces.json file', () => {
  it('should extract displayName and schema from virtual block', () => {
    const generatedInterface = generateInterface(exampleWithAssignments);

    expect(generatedInterface?.displayName).toEqual('hello-world');
    expect(generatedInterface?.schema).toEqual({
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
    });
  });

  it('should generate interfaces.json file for a virtual block', () => {
    const generatedInterface = generateInterface(exampleWithAssignments);

    expect(generatedInterface?.interfacesFile).toMatchSnapshot();
  });
});
