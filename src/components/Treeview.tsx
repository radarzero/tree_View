import React, { Component } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Icon, Input } from "semantic-ui-react";
import nodes from "./treeData";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { debounce } from "lodash";
import "../App.css";
export class Treeview extends Component {
  state = {
    checked: [], //for any node you wanted to check box tick before hand then provide its value to checked array
    expanded: nodes.map((item) => item.value), //for any node you wanted to expanded before hand then provide its value to expanded array
    filterText: "",
    nodesFiltered: nodes,
    nodes,
    clicked: { value: "" },
    loading: false,
    outputCheckedArr: [] as any,
    // for removing check box=>make it true and follow the line below instruction
    checkboxDisplayNone: true, //update css property .rct-checkbox{display:none} for 'true'
  };

  constructor(props: any) {
    super(props);

    this.onCheck = this.onCheck.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.filterTree = this.filterTree.bind(this);
    this.filterNodes = this.filterNodes.bind(this);
    this.onClick = this.onClick.bind(this);
    this.resetFilterText = this.resetFilterText.bind(this);
    this.collapesedAllHandler = this.collapesedAllHandler.bind(this);
    this.expandAllHandler = this.expandAllHandler.bind(this);
    this.expandOnFilter = this.expandOnFilter.bind(this);
  }
  // method to expand tree node on filter
  expandOnFilter(this: any) {
    // for expanding all nodes that satify filter text
    let resArr: any[] = [];
    function expander(item: any) {
      resArr.push(item.value);
      item.children && item.children.forEach(expander);
    }
    this.state.nodesFiltered.forEach(expander);
    this.setState({
      expanded: resArr,
    });
  }
  // method to update the state of  the tree node(selected or not selected)
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
    let diff = checked.filter(
      (x: any) => !this.state.outputCheckedArr.includes(x)
    );
    this.setState({
      outputCheckedArr: this.state.outputCheckedArr.concat(diff),
    });
    let newDiff = this.state.outputCheckedArr.filter(
      (x: any) => !checked.includes(x)
    );
    if (newDiff.length) {
      let tempArr = this.state.outputCheckedArr;
      for (let i = 0; i < newDiff.length; i++) {
        tempArr = tempArr.filter((item: any) => item !== newDiff[i]);
      }
      this.setState({ outputCheckedArr: tempArr });
    }
  }
  // method to update state of only parent nodes(Expanded or not Expanded)
  onExpand(expanded: any) {
    this.setState({ expanded });
  }

  // Filtering Methods these three method combine gives filtering functionality

  onFilterChange = debounce((searchText: string) => {
    this.setState(
      {
        filterText: searchText.trimStart().trimEnd(),
      },
      this.filterTree
    );
    if (searchText.length > 0) {
      this.expandOnFilter();
    } else {
      this.setState({
        expanded: nodes.map((item) => item.value),
      });
    }
  }, 500);

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
      filtered.push({ ...node, ...(children.length && { children }) });
    }

    return filtered;
  }
  // method to reset filter text
  resetFilterText(this: any) {
    let search = document.getElementById("search-input") as HTMLInputElement;
    search.value = "";
    this.setState({
      filterText: "",
      nodesFiltered: nodes,
      expanded: nodes.map((item) => item.value),
    });
  }
  // method to handle collapsed all
  collapesedAllHandler(this: any) {
    this.setState({
      expanded: [],
    });
  }
  // method to handle expand all
  expandAllHandler(this: any) {
    let resExpandedArr: any[] = [];
    function expander(item: any) {
      resExpandedArr.push(item.value);
      item.children && item.children.forEach(expander);
    }
    nodes.forEach(expander);
    this.setState({
      expanded: resExpandedArr,
    });
  }

  // .........................
  render() {
    const {
      checked,
      expanded,
      filterText,
      nodesFiltered,
      loading,
      clicked,
      checkboxDisplayNone,
      outputCheckedArr,
    } = this.state;
    checkboxDisplayNone
      ? clicked.value && console.log(clicked.value)
      : checked.length > 0 && console.log(outputCheckedArr);

    return (
      <div className="tree-control-view">
        <div className="control-view">
          <Input
            icon={{
              name: filterText ? "close" : "search",
              circular: false,
              link: filterText ? true : false,
              onClick: this.resetFilterText,
            }}
            loading={loading}
            placeholder="Search..."
            className="filter-text"
            type="search"
            // value={filterText} remove due to adding debounce
            onChange={(e) => this.onFilterChange(e.target.value)}
            id="search-input"
          />
          <button
            className="controller-btn"
            aria-label="CollapseAll"
            title="CollapseAll"
            onClick={this.collapesedAllHandler}
          >
            <Icon name="level up alternate" />
          </button>
          <div className="vertical-rule"></div>
          <button
            className="controller-btn"
            aria-label="ExpandAll"
            title="ExpandAll"
            onClick={this.expandAllHandler}
          >
            <Icon name="level down alternate" />
          </button>
        </div>
        <div className="tree-view">
          <CheckboxTree
            checked={checked}
            expanded={expanded}
            iconsClass="fa5"
            nodes={nodesFiltered}
            onCheck={this.onCheck}
            onExpand={this.onExpand}
            onClick={this.onClick}
            expandOnClick
            icons={{
              expandAll: <span className="fas fa-level-down-alt" />,
              collapseAll: <span className="fas fa-level-up-alt" />,
            }}
          />
          {this.state.nodesFiltered.length ? (
            <></>
          ) : (
            <span className="no-match">
              No Results for "{filterText}"<br />
              Suggestions:
              <ul>
                <li>-Make sure that all words are spelled correctly.</li>
                <li>-Try different search text.</li>
              </ul>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Treeview;
