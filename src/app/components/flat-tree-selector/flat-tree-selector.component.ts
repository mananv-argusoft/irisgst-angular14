import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import { Company } from '../../models/company.model'

import { BusinessService } from 'src/app/services/business.service';

export class CompanyNode {
  children: CompanyNode[];
  item: Company
}

export class CompanyFlatNode {
  item: Company;
  level: number;
  expandable: boolean;
}

// const TREE_DATA = {
//   Groceries: {
//     'Almond Meal flour': null,
//     'Organic eggs': null,
//     'Protein Powder': null,
//     Fruits: {
//       Apple: null,
//       Berries: ['Blueberry', 'Raspberry'],
//       Orange: null,
//     },
//   },
//   Reminders: [
//     'Cook dinner',
//     'Read the Material Design spec',
//     'Upgrade Application to Angular',
//   ],
// };

@Injectable()
export class ChecklistDatabase {
  public dataChange = new BehaviorSubject<CompanyNode[]>([]);
  public selectedCompany: Company = null


  get data(): CompanyNode[] {
    return this.dataChange.value;
  }

  constructor(private businessService: BusinessService) {
    this.businessService.selectedRootCompany.subscribe(selectedCompany => {
      this.selectedCompany = new Company()
      this.selectedCompany['company'] = selectedCompany
      this.initialize();
    })
  }

  initialize() {
    const data = this.buildFileTree(this.selectedCompany, 0);
    // console.log('data = ', data)  

    this.dataChange.next(data);
  }

  buildFileTree(obj: { [key: string]: any }, level: number): CompanyNode[] {
    return Object.keys(obj).reduce<CompanyNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new CompanyNode();
      // console.log('key = ', key, ' value = ', value);
      // node.item = key;


      if (value != null && typeof value === 'object') {
        // node.children = this.buildFileTree(value, level + 1);
        node.item = value;
        node.children = []
        if (value['childCompanies'] && value['childCompanies'].length>0) {
          value['childCompanies'].map(cc => {
            // console.log('cc = ', cc)
            const childCompany = { company: cc }
            node.children.push(this.buildFileTree(childCompany, level+1)[0])
            // console.log('bft = ', this.buildFileTree(childCompany, level+1))
          })
        }
      }
      // console.log('node = ', node)
      
      return accumulator.concat(node);
    }, []);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-flat-tree-selector',
  templateUrl: 'flat-tree-selector.component.html',
  styleUrls: ['flat-tree-selector.component.css'],
  providers: [ChecklistDatabase],
})
export class FlatTreeSelectorComponent {
  @Output() gstinChanged = new EventEmitter<any>()

  public flatNodeMap = new Map<CompanyFlatNode, CompanyNode>();

  public nestedNodeMap = new Map<CompanyNode, CompanyFlatNode>();

  public selectedParent: CompanyFlatNode | null = null;

  public newItemName = '';

  public treeControl: FlatTreeControl<CompanyFlatNode>;

  public treeFlattener: MatTreeFlattener<CompanyNode, CompanyFlatNode>;

  public dataSource: MatTreeFlatDataSource<CompanyNode, CompanyFlatNode>;

  public checklistSelection = new SelectionModel<CompanyFlatNode>(
    true /* multiple */
  );

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<CompanyFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: CompanyFlatNode) => node.level;

  isExpandable = (node: CompanyFlatNode) => node.expandable;

  getChildren = (node: CompanyNode): CompanyNode[] => node.children;

  hasChild = (_: number, _nodeData: CompanyFlatNode) => _nodeData.expandable;

  // hasNoContent = (_: number, _nodeData: CompanyFlatNode) =>_nodeData.item === '';

  hasNoContent = (_: number, _nodeData: CompanyFlatNode) =>_nodeData.item === null;

  transformer = (node: CompanyNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new CompanyFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  descendantsAllSelected(node: CompanyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: CompanyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  itemSelectionToggle(node: CompanyFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
    ? this.checklistSelection.select(...descendants)
    : this.checklistSelection.deselect(...descendants);
    
    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

    this.gstinChanged.emit(this.checklistSelection['_selection'])
    // console.log('sdfhkjasdf = ', this.checklistSelection);
  }

  leafItemSelectionToggle(node: CompanyFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    
    this.gstinChanged.emit(this.checklistSelection['_selection'])
    // console.log('sdfhkjasdf = ', this.checklistSelection);
  }

  checkAllParentsSelection(node: CompanyFlatNode): void {
    let parent: CompanyFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: CompanyFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: CompanyFlatNode): CompanyFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}