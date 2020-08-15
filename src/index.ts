import { PluginObj, types, Visitor } from '@babel/core'

const ObjectExpressionVisitor: Visitor = {
  ObjectExpression(path) {
    const { node } = path

    const newSchema = node.properties.filter(
      (objProperty) =>
        types.isObjectProperty(objProperty) &&
        types.isIdentifier(objProperty.key) &&
        objProperty.key.name === 'title'
    )

    if (newSchema.length === 0) {
      throw new Error(
        'Found a .schema definition with no title. Please add a title to your schema.'
      )
    }

    node.properties = newSchema
  },
}

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

        if (isDisplayName) {
          parentPath.remove()
        } else if (isSchemaDefinition) {
          path.traverse(ObjectExpressionVisitor as Visitor)
        }
      },
    },
  }
}
