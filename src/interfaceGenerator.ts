/**
 * This is an example implementation for a simple builder that is capable
 * of generating an interfaces.json file for a given Virtual Block.
 */

import { parseSync, traverse, types } from '@babel/core';
import generate from '@babel/generator';

function generateInterface(source: string) {
  const parseResult = parseSync(source, {
    plugins: ['@babel/plugin-syntax-jsx'],
  });

  if (!parseResult) {
    return null;
  }

  let schema: Record<string, any> = {};
  let displayName: string = '';
  let componentName = '';

  traverse(parseResult!, {
    AssignmentExpression(path) {
      const { node } = path;
      const isObjectPropertyAssignment = types.isMemberExpression(node.left);

      if (!isObjectPropertyAssignment) {
        return;
      }

      const isDisplayName = types.isIdentifier((node.left as any).property, {
        name: 'displayName',
      });

      const isSchemaDefinition = types.isIdentifier(
        (node.left as any).property,
        {
          name: 'schema',
        }
      );

      if (isDisplayName) {
        displayName = generate(node.right).code.slice(1, -1);
      }

      if (isSchemaDefinition) {
        const generatedCode = generate(node.right).code;
        const validJsonString = generatedCode
          .replace(/(\w+:)|(\w+ :)/g, function(match: string) {
            return '"' + match.substring(0, match.length - 1) + '":';
          })
          .replace(/'/g, `"`);

        schema = JSON.parse(validJsonString);
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;

      const isIdentifierExport = types.isIdentifier(node.declaration);

      if (isIdentifierExport) {
        componentName = (node.declaration as types.Identifier).name;
      }
    },
  });

  const interfacesFile = `{
    "${displayName}": {
      "component": "${componentName}",
      "content": ${JSON.stringify(schema)}
    }
  }`;

  return { displayName, schema, interfacesFile };
}

export default generateInterface;
