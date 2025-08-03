// composables/useTree.ts
import type {TreeNode} from "~/types/TreeNode";

export const useTree = () => {
  // 改為陣列結構，不需要根節點
  const treeData = useState<TreeNode[]>("treeData", () => [
    {
      id: "1",
      name: "📁 專案名稱",
      isFolder: true,
      children: [
        {id: "1-1", name: "📄 Note1.md", isFolder: false},
        {id: "1-2", name: "📄 README.md", isFolder: false},
      ],
    },
    {
      id: "2",
      name: "📁 日常筆記",
      isFolder: true,
      children: [{id: "2-1", name: "📄 2024-01-01.md", isFolder: false}],
    },
    {
      id: "3",
      name: "📄 Quick Note.md",
      isFolder: false,
    },
  ]);

  const findNodeById = (
    nodeId: string,
    nodes: TreeNode[] = treeData.value
  ): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = findNodeById(nodeId, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentNode = (
    targetId: string,
    nodes: TreeNode[] = treeData.value,
    parent: TreeNode | null = null
  ): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === targetId) return parent;
      if (node.children) {
        const found = findParentNode(targetId, node.children, node);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const addProject = (name: string, parentId?: string) => {
    const newProject = {
      id: Date.now().toString(),
      name: `📁 ${name}`,
      isFolder: true,
      children: [],
    };

    if (!parentId) {
      // 添加到根層
      treeData.value.push(newProject);
    } else {
      // 添加到指定父節點
      const parentNode = findNodeById(parentId);
      if (parentNode && parentNode.isFolder) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(newProject);
      }
    }
  };

  const addFile = (name: string, parentId?: string) => {
    const newFile = {
      id: Date.now().toString(),
      name: `📄 ${name}`,
      isFolder: false,
    };

    if (!parentId) {
      // 添加到根層
      treeData.value.push(newFile);
    } else {
      // 添加到指定父節點
      const parentNode = findNodeById(parentId);
      if (parentNode && parentNode.isFolder) {
        if (!parentNode.children) parentNode.children = [];
        parentNode.children.push(newFile);
      }
    }
  };

  const deleteNode = (nodeId: string) => {
    const deleteFromNodes = (nodes: TreeNode[]): boolean => {
      const index = nodes.findIndex((node) => node.id === nodeId);
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      for (const node of nodes) {
        if (node.children && deleteFromNodes(node.children)) {
          return true;
        }
      }
      return false;
    };
    deleteFromNodes(treeData.value);
  };

  return {
    treeData,
    addProject,
    addFile,
    deleteNode,
    findNodeById,
  };
};
