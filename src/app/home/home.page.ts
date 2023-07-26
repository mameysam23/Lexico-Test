import { Component } from '@angular/core';
import { DataList, DataResponse, ListItem } from '../_models';
import { HttpService } from '../_services/http.service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  treeData: any;
  rawData: DataResponse = {} as DataResponse;
  treeControl: NestedTreeControl<ListItem>;
  dataSource: MatTreeNestedDataSource<ListItem>;
  constructor(private httpService: HttpService) {
    this.treeControl = new NestedTreeControl<ListItem>(this.getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.getDataList();

    
  }

  // Get data from http
  getDataList() {
    this.httpService.getListData().subscribe((data: DataResponse) => {
      this.rawData = data as DataResponse;
      this.treeData = this.parseJsonData(data.data);

      this.dataSource.data = this.treeData.list0;
    });
  }

  // Check if the node has a child
  hasChild = (_: number, node: ListItem): boolean => {
    return !!node.children && node.children.length > 0;
  };

  // Check if the node has a nested child
  hasNestedChild = (_: number, node: ListItem): boolean => {
    return (
      !!node.children &&
      node.children.some(
        (child) => !!child.children && child.children.length > 0
      )
    );
  };

  private parseJsonData(jsonData: any): DataList {
    // Map the flat list into a hierarchical structure
    const itemMap = new Map<number, ListItem>();
    jsonData.list0.forEach((item: ListItem) => (item.children = []));
    jsonData.list0.forEach((item: ListItem) => itemMap.set(item.id, item));
    jsonData.list0.forEach((item: ListItem) => {
      const parentItem = itemMap.get(item.parentId);
      if (parentItem) {
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.push(item);
      }
    });

    return {
      list0: jsonData.list0.filter((item: ListItem) => {
        if (item.parentId === 0) {
          return item;
        }
        return;
      }),
      list1: jsonData.list1,
    };
  } 

  // get list of children
  getChildren = (node: ListItem): ListItem[] => {
    return node.children ? node.children : [];
  };

  //Filter the tree and list using the input query
  filter(event: any) {
    let query = event.target.value.trim().toLowerCase();
    let filteredData: DataList = {} as DataList;
    if (query) {
      filteredData.list0 = this.rawData.data.list0.filter((item) =>
        item.name.trim().toLowerCase().includes(query)
      );
      filteredData.list1 = this.rawData.data.list1.filter((item) =>
        item.name.trim().toLowerCase().includes(query)
      );
    } else {
      filteredData = this.rawData.data;
    }
    this.treeData = this.parseJsonData(filteredData);
    console.log(this.treeData);

    this.dataSource.data = this.treeData.list0;
  }

  // Sort data by alphabetical order
  order = false;
  sort() {
    this.order = !this.order;
    let sortedData: DataList = {} as DataList;
    sortedData.list0 = this.rawData.data.list0.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    sortedData.list1 = this.rawData.data.list1.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    if (!this.order) {
      sortedData.list0.reverse();
      sortedData.list1.reverse();
    }
    this.treeData = this.parseJsonData(sortedData);
    this.dataSource.data = this.treeData.list0;
  }
}
