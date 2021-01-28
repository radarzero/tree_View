import React, { Component } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Grid, Icon, Input, Segment } from "semantic-ui-react";
import nodes from "./treeData";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
export class Treeview extends Component {
  state = {
    checked: [
      "/app/Http/Controllers/WelcomeController.js",
      "/app/Http/routes.js",
      "/public/assets/style.css",
      "/public/index.html",
      "/.gitignore",
    ],
    expanded: ["/app"],
    filterText: "",
    nodesFiltered: nodes,
    nodes,
  };

  constructor(props: any) {
    super(props);

    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.filterTree = this.filterTree.bind(this);
    this.filterNodes = this.filterNodes.bind(this);
  }
  //   high lighting function
  highLighter() {
    let SearachKey = this.state.filterText.toLocaleLowerCase();
    let nodes = document.getElementsByClassName("rct-title");
    if (!(SearachKey === "")) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].innerHTML.toLocaleLowerCase().includes(SearachKey)) {
          nodes[i].classList.add("high-light");
        } else {
          nodes[i].classList.remove("high-light");
        }
      }
    }
    if (SearachKey === "") {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("high-light");
      }
    }
  }
  componentDidUpdate() {
    this.highLighter();
  }

  // ..............

  onCheck(checked: any) {
    this.setState({ checked });
  }

  onExpand(expanded: any) {
    this.setState({ expanded });
  }

  onFilterChange(e: any) {
    this.setState(
      { filterText: e.target.value.trimStart().trimEnd() },
      this.filterTree
    );
  }

  filterTree() {
    // Reset nodes back to unfiltered state
    if (!this.state.filterText) {
      this.setState((prevState: any) => ({
        nodesFiltered: prevState.nodes,
      }));

      return;
    }

    const nodesFiltered = (prevState: any) => ({
      nodesFiltered: prevState.nodes.reduce(this.filterNodes, []),
    });

    this.setState(nodesFiltered);
  }

  filterNodes(filtered: any, node: any) {
    const { filterText } = this.state;
    const children = (node.children || []).reduce(this.filterNodes, []);

    if (
      // Node's label matches the search string
      node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >
        -1 ||
      // Or a children has a matching node
      children.length
    ) {
      filtered.push({ ...node, children });
    }

    return filtered;
  }

  render() {
    const { checked, expanded, filterText, nodesFiltered } = this.state;

    return (
      <div className="controller">
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment id="search-bar">
                <Input
                  icon={<Icon name="search" inverted circular link />}
                  placeholder="Search..."
                  className="filter-text"
                  type="text"
                  value={filterText}
                  onChange={this.onFilterChange}
                />
              </Segment>

              <Segment id="tree-view">
                {this.state.nodesFiltered.length ? (
                  <></>
                ) : (
                  <span style={{ color: "red" }}>no match found</span>
                )}
                <CheckboxTree
                  checked={checked}
                  expanded={expanded}
                  iconsClass="fa5"
                  nodes={nodesFiltered}
                  onCheck={this.onCheck}
                  onExpand={this.onExpand}
                  showExpandAll
                  onlyLeafCheckboxes
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Treeview;
