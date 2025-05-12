export function getPathComponents(path: string | null) {
    let components :string[] = [];
  
    if (path) {
        components = new URL(path).pathname.split('/').filter(Boolean);
    }
  
    return components;
  }
  