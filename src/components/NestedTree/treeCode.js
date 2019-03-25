import type { TreeData } from '../src/types';
import TreeBuilder from './TreeBuilder';
export const complexTree: TreeData =
new TreeBuilder(0)
  .withSubTree(
 new TreeBuilder(2)
  .withLeaf(1)
 )
  .withSubTree(
 new TreeBuilder(3)
  .withLeaf(2)
 )
  .withSubTree(
 new TreeBuilder(4)
  .withLeaf(3)
 )
  .withSubTree(
 new TreeBuilder(5)
  .withLeaf(4)
  .withLeaf(5)
 )
  .withSubTree(
 new TreeBuilder(6)
  .withLeaf(6)
 )
  .withSubTree(
 new TreeBuilder(8)
  .withLeaf(7)
 )
  .withSubTree(
 new TreeBuilder(9)
  .withLeaf(8)
 )
  .withSubTree(
 new TreeBuilder(10)
  .withLeaf(9)
 )
  .withSubTree(
 new TreeBuilder(11)
  .withLeaf(10)
  .withLeaf(11)
  .withLeaf(12)
 )
  .withSubTree(
 new TreeBuilder(12)
  .withLeaf(13)
  .withLeaf(14)
  .withLeaf(15)
  .withLeaf(16)
 )
  .withSubTree(
 new TreeBuilder(13)
  .withLeaf(17)
 )
  .withSubTree(
 new TreeBuilder(14)
  .withLeaf(18)
  .withLeaf(19)
  .withLeaf(20)
 )
  .withSubTree(
 new TreeBuilder(15)
  .withLeaf(21)
  .withLeaf(22)
 )
  .withSubTree(
 new TreeBuilder(16)
  .withLeaf(23)
 )
  .withSubTree(
 new TreeBuilder(17)
  .withLeaf(24)
 )
  .withSubTree(
 new TreeBuilder(18)
  .withLeaf(25)
 )
  .withSubTree(
 new TreeBuilder(19)
  .withLeaf(26)
 )
  .withSubTree(
 new TreeBuilder(20)
  .withLeaf(27)
 )
  .withSubTree(
 new TreeBuilder(21)
  .withLeaf(28)
  .withLeaf(29)
 )
  .withSubTree(
 new TreeBuilder(22)
  .withLeaf(30)
 )
  .withSubTree(
 new TreeBuilder(23)
  .withLeaf(31)
 )
  .withSubTree(
 new TreeBuilder(24)
  .withLeaf(32)
 )
  .withSubTree(
 new TreeBuilder(25)
  .withLeaf(33)
 )
  .withSubTree(
 new TreeBuilder(26)
  .withLeaf(34)
 )
  .withSubTree(
 new TreeBuilder(27)
  .withLeaf(35)
 )
  .withSubTree(
 new TreeBuilder(28)
  .withLeaf(36)
  .withLeaf(37)
  .withLeaf(38)
 )
  .withSubTree(
 new TreeBuilder(29)
  .withLeaf(39)
 )
  .withSubTree(
 new TreeBuilder(30)
  .withLeaf(40)
 )
  .withSubTree(
 new TreeBuilder(31)
  .withLeaf(41)
 )
  .withSubTree(
 new TreeBuilder(32)
  .withLeaf(42)
 )
  .withSubTree(
 new TreeBuilder(33)
  .withLeaf(43)
 )
  .withSubTree(
 new TreeBuilder(34)
  .withLeaf(44)
 )
  .withSubTree(
 new TreeBuilder(35)
  .withLeaf(45)
 )
  .withSubTree(
 new TreeBuilder(36)
  .withLeaf(46)
 )
  .withSubTree(
 new TreeBuilder(37)
  .withLeaf(47)
  .withLeaf(48)
  .withLeaf(49)
  .withLeaf(50)
 )
  .withSubTree(
 new TreeBuilder(38)
  .withLeaf(51)
 )
  .withSubTree(
 new TreeBuilder(39)
  .withLeaf(52)
)
.build();