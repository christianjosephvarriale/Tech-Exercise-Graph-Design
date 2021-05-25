module.exports = function sortCategoriesForInsert (inputJson) {
    /**
    * I assume that a catagory can have multiple child catagories
    */

    // Create a network of graphs to represent the top level catagories and their children
    const graphNetwork = new Graph()
    const topLevelNodes = []
    let properJsonOutput = []

    inputJson.forEach( obj => {

        // if we are a top level catagory, add to queue
        if ( obj.parent_id == null ) {
            topLevelNodes.push( obj.id )
        } 

        graphNetwork.addMapping( obj )
        graphNetwork.addEdge(obj.parent_id, obj.id)
    });

    // perform Bfs on each top level node to construct the ordering
    topLevelNodes.forEach( node => {
        properJsonOutput = properJsonOutput.concat(graphNetwork.bfs(node))
    })

    return properJsonOutput
  }

// simple graph datastructure with ajacency list and hashtable to map id -> object
class Graph {
    constructor() {
        this.adjacencyList = {};
        this.hashTable = {};
    }
    addMapping(object) {
        this.hashTable[ object.id ] = object
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
        }
    }
    addEdge(source, destination) {
        if ( source == null ) {
            this.addVertex(destination)
            return
        }
        if (!this.adjacencyList[source]) {
            this.addVertex(source);
        }
        if (!this.adjacencyList[destination]) {
            this.addVertex(destination);
        }
        this.adjacencyList[source].push(destination);
        this.adjacencyList[destination].push(source);
    }
}

// bfs implementation to traverse the catagories and it's children
Graph.prototype.bfs = function(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;
    while (queue.length) {
      currentVertex = queue.shift();
      result.push(this.hashTable[currentVertex]);
      this.adjacencyList[currentVertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    return result;
}