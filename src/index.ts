import { PluginObj, types } from '@babel/core';

export default function(): PluginObj {
  return {
    visitor: {
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

        if (isDisplayName || isSchemaDefinition) {
          path.parentPath.remove();
        }
      },
    },
  };
}
