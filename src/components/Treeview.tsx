import React, { Component } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Button, Divider, Icon, Input, Segment } from "semantic-ui-react";
import nodes from "./treeData";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../App.css";

export class Treeview extends Component {
  state = {
    //  for any node you wanted to check box tick before hand then provide its value to checked array
    checked: [],
    //  for any node you wanted to expanded before hand then provide its value to expanded array
    expanded: ["/app"],
    filterText: "",
    nodesFiltered: nodes,
    nodes,
    clicked: { value: "" },
  };

  constructor(props: any) {
    super(props);

    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.filterTree = this.filterTree.bind(this);
    this.filterNodes = this.filterNodes.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  onClick(clicked: any) {
    this.setState({ clicked });
  }
  //   high lighting function over filter
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
    const {
      checked,
      expanded,
      filterText,
      nodesFiltered,
      clicked,
    } = this.state;
    const notClickedText = "(none)";

    return (
      <>
        <Segment style={{ float: "right", marginRight: "550px" }}>
          <strong>Clicked Node</strong>: {clicked.value || notClickedText}
        </Segment>
        <div className="controller">
          <Segment>
            <Input
              icon={<Icon name="search" />}
              placeholder="Search..."
              className="filter-text"
              type="text"
              value={filterText}
              onChange={this.onFilterChange}
            />

            <CheckboxTree
              checked={checked}
              expanded={expanded}
              iconsClass="fa5"
              nodes={nodesFiltered}
              onCheck={this.onCheck}
              onExpand={this.onExpand}
              showExpandAll
              onClick={this.onClick}
            />
            {this.state.nodesFiltered.length ? (
              <></>
            ) : (
              <span id="no-match">
                <br />
                <Icon name="x" />
                no match found
              </span>
            )}
            <Divider />
            <Button primary style={{ marginLeft: "60%" }}>
              View More
            </Button>
          </Segment>
        </div>
      </>
    );
  }
}

export default Treeview;
