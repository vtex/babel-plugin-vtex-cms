import { PluginObj, types } from '@babel/core'

export default function(): PluginObj {
  return {
    visitor: {
      AssignmentExpression(path) {
        const { node, parentPath } = path
        const isObjectPropertyAssignment = types.isMemberExpression(node.left)

        if (!isObjectPropertyAssignment) {
          return
        }

        const isDisplayName = types.isIdentifier(
          (node.left as types.MemberExpression).property,
          {
            name: 'displayName',
          }
        )

        const isSchemaDefinition = types.isIdentifier(
          (node.left as types.MemberExpression).property,
          {
            name: 'schema',
          }
        )

        if (isDisplayName || isSchemaDefinition) {
          parentPath.remove()
        }
      },
    },
  }
}
