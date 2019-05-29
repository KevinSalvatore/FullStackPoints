const { Graph } = require('../../index');

describe('Graph', () => {
  let graph;
  const getValues = node => (Array.isArray(node) ? node.map(a => getValues(a)) : node.value);

  beforeEach(() => {
    graph = new Graph();
  });

  describe('#addVertex', () => {
    it('should add vertex to graph', () => {
      const node = graph.addVertex('a');
      expect(node.value).toBe('a');
      expect(graph.nodes.size).toBe(1);
    });

    it('should not add duplicated values', () => {
      const node1 = graph.addVertex('a');
      const node2 = graph.addVertex('a');
      expect(graph.nodes.size).toBe(1);
      expect(node1).toBe(node2);
    });
  });

  describe('#removeVertex', () => {
    beforeEach(() => {
      graph.addVertex('a');
    });

    it('should remove vertex', () => {
      expect(graph.removeVertex('a')).toBe(true);
      expect(graph.nodes.size).toBe(0);
      expect(graph.removeVertex('a')).toBe(false);
    });
  });

  describe('#addEdge', () => {
    it('should create node if they dont exist', () => {
      graph.addEdge('a', 'b');
      expect(graph.nodes.size).toBe(2);
    });

    it('should add node a as adjacent of b', () => {
      const [a, b] = graph.addEdge('a', 'b');
      expect(a.getAdjacents().map(getValues)).toEqual(['b']);
      expect(b.getAdjacents().map(getValues)).toEqual([]);

      graph.addEdge('b', 'a');
      expect(b.getAdjacents().map(getValues)).toEqual(['a']);
    });

    it('should add both connection on undirected graph', () => {
      graph = new Graph(Graph.UNDIRECTED);
      const [a, b] = graph.addEdge('a', 'b');
      expect(a.getAdjacents().map(getValues)).toEqual(['b']);
      expect(b.getAdjacents().map(getValues)).toEqual(['a']);
    });

    it('should add falsy values', () => {
      const [first, second] = graph.addEdge(0, false);
      expect(first.value).toBe(0);
      expect(second.value).toBe(false);
    });
  });

  describe('#removeEdge', () => {
    beforeEach(() => {
      graph.addEdge('a', 'b');
    });

    it('should remove edges if they exist', () => {
      const [a, b] = graph.removeEdge('a', 'b');
      expect(a.getAdjacents().map(getValues)).toEqual([]);
      expect(b.getAdjacents().map(getValues)).toEqual([]);
    });

    it('should remove edges with falsy values', () => {
      const [a, b] = graph.addEdge(0, false);
      expect(a.getAdjacents().map(getValues)).toEqual([false]);
      expect(b.getAdjacents().map(getValues)).toEqual([]);
      graph.removeEdge(0, false);
      expect(a.getAdjacents().map(getValues)).toEqual([]);
      expect(b.getAdjacents().map(getValues)).toEqual([]);
    });

    it('should not create node when removing unexisting target', () => {
      const [a, c] = graph.removeEdge('a', 'c');
      expect(graph.nodes.size).toBe(2);
      expect(a.getAdjacents().map(getValues)).toEqual(['b']);
      expect(c).toBe(undefined);
    });

    it('should not create node when removing unexisting nodes', () => {
      const [d, c] = graph.removeEdge('d', 'c');
      expect(graph.nodes.size).toBe(2);
      expect(c).toBe(undefined);
      expect(d).toBe(undefined);
    });
  });

  describe('#areAdjacents', () => {
    it('should return true if nodes are adjacent', () => {
      graph.addEdge('a', 'b');
      expect(graph.areAdjacents('a', 'b')).toBe(true);
    });

    it('should return false if a digraph nodes are adjacent in one direction only', () => {
      graph.addEdge('a', 'b');
      expect(graph.areAdjacents('b', 'a')).toBe(false);
    });

    it('should return true if a undirected graph nodes are adjacent', () => {
      graph = new Graph(Graph.UNDIRECTED);
      graph.addEdge('a', 'b');
      expect(graph.areAdjacents('b', 'a')).toBe(true);
    });

    it('should return false if nodes does not exist', () => {
      expect(graph.areAdjacents('a', 'b')).toBe(false);
    });

    it('should return false if nodes are not adjacent', () => {
      graph.addVertex('a');
      graph.addVertex('b');
      expect(graph.areAdjacents('a', 'b')).toBe(false);
    });
  });

  describe('remove vertex and update adjacency list', () => {
    let n1;
    let n2;
    let n4;

    beforeEach(() => {
      //   5
      //  /^
      // 0 -> 1 <- 2
      //      ^\-> 4 -> 3
      graph.addEdge(0, 1);
      [n2] = graph.addEdge(2, 1);
      [n1, n4] = graph.addEdge(1, 4);
      graph.addEdge(4, 1);
      graph.addEdge(4, 3);
    });

    it('should remove nodes from adjacent list', () => {
      expect(n4.getAdjacents().map(getValues)).toEqual([1, 3]);
      expect(n2.getAdjacents().map(getValues)).toEqual([1]);
      expect(graph.nodes.has(n1.value)).toBe(true);
      graph.removeVertex(1);
      expect(n4.getAdjacents().map(getValues)).toEqual([3]);
      expect(graph.nodes.has(n1.value)).toBe(false);
    });
  });

  describe('Graph Search', () => {
    let first;

    beforeEach(() => {
      graph.addEdge(0, 5);
      graph.addEdge(0, 4);
      [first] = graph.addEdge(0, 1);

      graph.addEdge(1, 4);
      graph.addEdge(1, 3);

      graph.addEdge(2, 1);

      graph.addEdge(3, 4);
      graph.addEdge(3, 2);
    });

    describe('#dfs', () => {
      it('should visit nodes using depth-first search', () => {
        const visitedOrder = Array.from(Graph.dfs(first)).map(getValues);
        expect(visitedOrder).toEqual([0, 1, 3, 2, 4, 5]);
      });
    });

    describe('#bfs', () => {
      it('should visit nodes using breadth-first search', () => {
        const visitedOrder = Array.from(Graph.bfs(first)).map(getValues);
        expect(visitedOrder).toEqual([0, 5, 4, 1, 3, 2]);
      });
    });
  });

  describe('Graph Search: UNDIRECTED', () => {
    let first;

    beforeEach(() => {
      graph = new Graph(Graph.UNDIRECTED);
      [first] = graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      graph.addEdge(1, 4);

      graph.addEdge(5, 2);
      graph.addEdge(6, 3);
      graph.addEdge(7, 3);
      graph.addEdge(8, 4);
      graph.addEdge(9, 5);
      graph.addEdge(10, 6);
    });

    describe('#dfs', () => {
      it('should visit nodes using depth-first search', () => {
        const visitedOrder = Array.from(Graph.dfs(first)).map(getValues);
        expect(visitedOrder).toEqual([1, 4, 8, 3, 7, 6, 10, 2, 5, 9]);
      });

      it('should use iterator', () => {
        const dfs = Graph.dfs(first);

        expect(dfs.next().value.value).toBe(1);
        expect(dfs.next().value.value).toBe(4);
        expect(dfs.next().value.value).toBe(8);
        expect(dfs.next().value.value).toBe(3);
        expect(dfs.next().value.value).toBe(7);
        expect(dfs.next().value.value).toBe(6);
        expect(dfs.next().value.value).toBe(10);
        expect(dfs.next().value.value).toBe(2);
        expect(dfs.next().value.value).toBe(5);
        expect(dfs.next().value.value).toBe(9);

        expect(dfs.next().value).toBe(undefined);
        expect(dfs.next().done).toBe(true);
      });
    });

    describe('#bfs', () => {
      it('should visit nodes using breadth-first search', () => {
        const visitedOrder = Array.from(Graph.bfs(first)).map(getValues);
        expect(visitedOrder).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });
  });

  describe('with (people) edges on undigraph', () => {
    let you;
    let mary;
    let barbara;

    beforeEach(() => {
      graph = new Graph(Graph.UNDIRECTED);
      [you] = graph.addEdge('you', 'mary');
      [mary, barbara] = graph.addEdge('mary', 'barbara');
    });

    describe('#areConnected', () => {
      it('should return true if two nodes are connected', () => {
        expect(graph.areConnected('you', 'barbara')).toBe(true);
      });

      it('should return true if two nodes are connected', () => {
        expect(graph.areConnected('you', 'you')).toBe(true);
      });

      it('should return true if two nodes are connected', () => {
        expect(graph.areConnected('you', 'John')).toBe(false);
      });
    });

    describe('#findPath', () => {
      it('should handle source === destination', () => {
        expect(graph.findPath('you', 'you')).toEqual([you]);
      });

      it('should get connecting path', () => {
        expect(graph.findPath('you', 'barbara').map(getValues)).toEqual(['you', 'mary', 'barbara']);
      });

      it('should get adjacent connecting path', () => {
        expect(graph.findPath('mary', 'barbara').map(getValues)).toEqual(['mary', 'barbara']);
        expect(graph.findPath('mary', 'barbara')).toEqual([mary, barbara]);
      });

      it('should return empty if there is no connection', () => {
        expect(graph.findPath('you', 'Obama').map(getValues)).toEqual([]);
      });
    });

    describe('#findAllPaths', () => {
      it('should handle source === destination', () => {
        expect(graph.findAllPaths('you', 'you')).toEqual([[you]]);
        expect(getValues(graph.findAllPaths('you', 'you'))).toEqual([['you']]);
      });

      it('should find all paths when only one', () => {
        expect(getValues(graph.findAllPaths('mary', 'barbara'))).toEqual([
          ['mary', 'barbara'],
        ]);
      });

      it('should find all paths', () => {
        graph.addEdge('you', 'barbara');
        expect(getValues(graph.findAllPaths('you', 'barbara'))).toEqual([
          ['you', 'mary', 'barbara'],
          ['you', 'barbara'],
        ]);
      });
    });
  });
});
