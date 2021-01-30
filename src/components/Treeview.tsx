import React, { Component } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Button, Divider, Icon, Input, List, Segment } from "semantic-ui-react";
import nodes from "./treeData";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../App.css";
export class Treeview extends Component {
  state = {
    checked: [], //for any node you wanted to check box tick before hand then provide its value to checked array
    expanded: ["app"], //for any node you wanted to expanded before hand then provide its value to expanded array
    filterText: "",
    nodesFiltered: nodes,
    nodes,
    clicked: {},
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
  // method to update the state of  the tree node(selected or not selected)
  //   it contain single value in Object(it is diffrent from check box selection)
  onClick(clicked: any) {
    this.setState({ clicked });
  }
  // method to high-light tree nodes over filter-text
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
  //   lifecycle method to trigger highLighting method on change of filter-text value
  componentDidUpdate() {
    this.highLighter();
  }

 
  // method to update state of all the tree nodes(Checked or UnChecked)
  onCheck(checked: any) {
    this.setState({ checked });
    console.log(this.state.checked);
  }
  // method to update state of only parent nodes(Expanded or not Expanded)
  onExpand(expanded: any) {
    this.setState({ expanded });
  }
  // Filtering Methods these three method combine gives filtering functionality
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
  // ..........................
  render() {
    const { checked, expanded, filterText, nodesFiltered } = this.state;

    return (
      <>
        <div className="controller">
          <Segment className="view-segement">
              
            <Input
              icon={<Icon name="search" />}
              placeholder="Search..."
              className="filter-text"
              type="text"
              value={filterText}
              onChange={this.onFilterChange}
              id="search-input"
            />
            <div id="check-box-tree">
              <CheckboxTree
                checked={checked}
                expanded={expanded}
                iconsClass="fa5"
                nodes={nodesFiltered}
                onCheck={this.onCheck}
                onExpand={this.onExpand}
                showExpandAll
                onClick={this.onClick}
                expandOnClick
                onlyLeafCheckboxes={true}
                icons={{
                  expandAll: <span className="fa fa-plus-square" />,
                  collapseAll: <span className="fa fa-minus-square" />,
                }}
              />
            </div>

            {this.state.nodesFiltered.length ? (
              <></>
            ) : (
              <span className="no-match">
               <br/><br/>
                <Icon name="x" />
                no match found
              </span>
            )}
          </Segment>
        </div>
      </>
    );
  }
}

export default Treeview;
