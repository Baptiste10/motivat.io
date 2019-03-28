//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import Tree, {
  mutateTree,
  moveItemOnTree,
  type RenderItemParams,
  type TreeItem,
  type TreeData,
  type ItemId,
  type TreeSourcePosition,
  type TreeDestinationPosition,
} from '@atlaskit/tree';
import { complexTree } from './treeCode';

const Container = styled.div`
  display: flex;
  width: 170;
`;

const Dot = styled.span`
  display: flex;
  width: 170;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

type State = {|
  tree: TreeData,
|};

export default class DragDropWithNestingTree extends Component<void, State> {
  state = {
    tree: complexTree,
  };

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
    if (item.children && item.children.length > 0) {
      return item.isExpanded ? (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onCollapse(item.id)}
        >
          <ChevronDownIcon
            label=""
            size="medium"
            onClick={() => onCollapse(item.id)}
          />
        </Button>
      ) : (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onExpand(item.id)}
        >
          <ChevronRightIcon
            label=""
            size="medium"
            onClick={() => onExpand(item.id)}
          />
        </Button>
      );
    }
    return <Dot>&bull;</Dot>;
  }

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
  }: RenderItemParams) => {
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <AkNavigationItem
          isDragging={snapshot.isDragging}
          text={item.data ? item.data.title : 'No title'}
          icon={DragDropWithNestingTree.getIcon(item, onExpand, onCollapse)}
          dnd={{ dragHandleProps: provided.dragHandleProps }}
        />
      </div>
    );
  };

  componentDidMount(){
    this.props.previewButton(false)
  }

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination: ?TreeDestinationPosition,
  ) => {
    const { tree } = this.state;
    console.log("Node moved from", source, " to destination ", destination)
    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: newTree,
    });
  };

  render() {
    const { tree } = this.state;

    return (
      <Container>
        <Navigation>
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onDragEnd={this.onDragEnd}
            isDragEnabled
            isNestingEnabled
          />
        </Navigation>
      </Container>
    );
  }
}
