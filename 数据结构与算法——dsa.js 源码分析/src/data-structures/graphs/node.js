const HashSet = require('../sets/hash-set');

// tag::constructor[]
/**
 * Graph node/vertex that hold adjacencies nodes
 * For performance, uses a HashSet instead of array for adjacents.
 */
class Node {
  constructor(value) {
    this.value = value;
    this.adjacents = new HashSet(); // adjacency list
  }
  // end::constructor[]

  // tag::addAdjacent[]
  /**
     * Add node to adjacency list
     * Runtime: O(1)
     * @param {Node} node
     */
  addAdjacent(node) {
    this.adjacents.add(node);
  }
  // end::addAdjacent[]

  // tag::removeAdjacent[]
  /**
     * Remove node from adjacency list
     * Runtime: O(1)
     * @param {Node} node
     * @returns removed node or `false` if node was not found
     */
  removeAdjacent(node) {
    return this.adjacents.delete(node);
  }
  // end::removeAdjacent[]

  // tag::isAdjacent[]
  /**
     * Check if a Node is adjacent to other
     * Runtime: O(1)
     * @param {Node} node
     */
  isAdjacent(node) {
    return this.adjacents.has(node);
  }
  // end::isAdjacent[]

  /**
     * Get all adjacent nodes
     */
  getAdjacents() {
    return Array.from(this.adjacents);
  }
  // tag::constructor[]
}
// end::constructor[]

module.exports = Node;
