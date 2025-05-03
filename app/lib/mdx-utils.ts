export function sanitizeMdxContent(content: string): string {
    if (!content) return '';
  
    return content
      // Normalize triple backtick code fences (add newline after language)
      .replace(/```(\w+)\s/g, '```$1\n')
  
      // Ensure all code blocks are properly closed
      .replace(/```(\w+)\n([\s\S]*?)(?=```|$)/g, '```$1\n$2\n```')
  
      // Escape inline JSX-ish code that causes Acorn to crash
      .replace(/`([^`]+)`/g, (_, code) =>
        '`' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '`'
      )
  
      // Escape braces that aren't valid JS expressions
      .replace(/({)([^}]*)(})/g, (_, open, inner, close) => {
        const looksLikeJsExpr = /=>|function|return|\$/.test(inner.trim());
        return looksLikeJsExpr ? `{${inner}}` : `{'${inner.replace(/'/g, "\\'")}'}`;
      })
  
      // Escape standalone < and > outside of code blocks
      .replace(/(?<![`])<([^>]+)>(?![`])/g, (_, inner) => `&lt;${inner}&gt;`);
  }