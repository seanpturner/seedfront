// import React, { Component } from "react";
// import AdminNav from './AdminNav';
// import { Link } from "react-router-dom";

// class template extends Component {
//   state = {
//     allItems: [],
//     newItem: {},
//     selectedItem: {},
//     dataSet: [],
//     sortDirection: descending,
//     sortedList: [],
//     sortBy: '',
//     searchResults: [],

//   };

//   componentDidMount = () => {
//     this.getFetch('lines', null, 'allLines', 'ascending');
//   };

//   //fetching

//   getFetch = (endpoint, path, statePosition, sortOrder) => {
//     let pathUrl = this.state.baseUrl + endpoint;
//     if (path != null) {
//       pathUrl = pathUrl + path;
//     }
//     this.doGetFetch(pathUrl, statePosition, sortOrder);
//   };

//   doGetFetch = (fetchUrl, statePosition, sortOrder) => {
//     let requestOptions = {
//       method: 'GET',
//     };

//     fetch(fetchUrl, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         this.objectSort(result, 'id', statePosition, sortOrder, true);
//         this.sortList(result, 'id');
//       });
//   };

//   //sorting

//   objectSort = (obj, sortKey, statePosition, sortOrder, updateAlphas) => {
//     let sortedObject = [];
//     obj.forEach((element) => {
//       sortedObject.push(element);
//     });
//     if (sortOrder === 'descending') {
//       sortedObject.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1));
//     } else {
//       sortedObject.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
//     }
//     this.setState({ [statePosition]: sortedObject });
//     if (updateAlphas) {
//       // setTimeout(() => {
//       //   this.objectSort(
//       //     this.state.allLines,
//       //     'name',
//       //     'sortAlphaLines',
//       //     'ascending',
//       //     false
//       //   );
//       //   this.objectSort(
//       //     this.state.allItems,
//       //     'name',
//       //     'sortAlphaItems',
//       //     'ascending',
//       //     false
//       //   );
//       //   this.lineSelectOptions('all');
//       //   this.plantSelectOptions();
//       // }, 100);
//     }
//   };

//   sortList = (list, by) => {
//     this.setState({ dataSet: by });
//     let sortDirection = this.state.sortDirection;
//     let sortBy = this.state.sortBy;
//     if (by === sortBy) {
//       if (sortDirection === 'ascending') {
//         sortDirection = 'descending';
//       } else {
//         sortDirection = 'ascending';
//       }
//       this.setState({ sortDirection: sortDirection });
//     }
//     if (sortDirection === 'ascending') {
//       list.sort((a, b) => (a[by] > b[by] ? 1 : -1));
//       this.setState({
//         sortedList: list,
//         sortBy: by,
//       });
//     }
//     if (sortDirection === 'descending') {
//       list.sort((a, b) => (a[by] < b[by] ? 1 : -1));
//       this.setState({
//         sortedList: list,
//         sortBy: by,
//       });
//     }
//   };

//   //arrays

//   removeFromUpdateArray = (member, element) => {
//     let np = this.state.newItem;
//     let existingArray = np[member];
//     let enIndex = existingArray.indexOf(element);
//     if (enIndex !== -1) {
//       existingArray.splice(enIndex, 1);
//       np[member] = existingArray;
//       this.setState({ newItem: np });
//     }
//   };

//   sortList = (list, by) => {
//     this.setState({ dataSet: by });
//     let sortDirection = this.state.sortDirection;
//     let sortBy = this.state.sortBy;
//     if (by === sortBy) {
//       if (sortDirection === 'ascending') {
//         sortDirection = 'descending';
//       } else {
//         sortDirection = 'ascending';
//       }
//       this.setState({ sortDirection: sortDirection });
//     }
//     if (sortDirection === 'ascending') {
//       list.sort((a, b) => (a[by] > b[by] ? 1 : -1));
//       this.setState({
//         sortedList: list,
//         sortBy: by,
//       });
//     }
//     if (sortDirection === 'descending') {
//       list.sort((a, b) => (a[by] < b[by] ? 1 : -1));
//       this.setState({
//         sortedList: list,
//         sortBy: by,
//       });
//     }
//   };

//   //search

//   searchFor = (key) => (event) => {
//     let noSpace = event.target.value.replace(/\s/g, '').toLowerCase();
//     let ap = this.state.allItems;
//     let returnArray = [];
//     this.setState({ searchString: noSpace });
//     ap.forEach((element) => {
//       let searchString = element.name
//         .replace(/\s/g, '')
//         .slice(0, noSpace.length)
//         .toLowerCase();
//       console.log(searchString);
//       if (noSpace === searchString) {
//         returnArray.push({ id: element.id, name: element.name });
//       }
//     });
//     this.setState({ searchResults: returnArray });
//   };

//   setSearchEntity = (id) => {
//     let ap = this.state.allItems;
//     ap.forEach((element) => {
//       if (element.id === id) {
//         this.setState({
//           selectedItem: element,
//           newItem: element,
//           searchResults: [],
//         });
//         document.getElementById('searchInput').value = '';
//       }
//     });
//   };

//   render() {
//     return <div className='adminPage'>
//       <div className="adminNavDiv">
//           <AdminNav />
//         </div>
//         <div className={selectedPlantDiv}>
//         <h1 className='adminSectionTitle'>Update A Plant</h1>
//         <p>
//           <Link to="" onClick={()=>{this.setState({
//                 selectedPlant: "none",
//                 newPlant: {},
//                 updateLineage: false
//               });
//               this.getFetch("lines", null, "allLines", "ascending");
//               this.getFetch("plants", null, "allPlants", "ascending");
//             }}>Back to plant list
//           </Link>
//         </p>
//         <p>
//           <table className='adminTable'>
//             <tr className='adminRow'>
//               {/* Row Headers */}
//               <td>Item Name</td>
//             </tr>
//             <tr className='adminRow'>
//               {/* Row Data */}
//               <td>{selectedItem.name}</td>
//               {/* <td>{selectedItem.notes?.map((note) => {
//                   return (
//                     <tr className='adminSubRow'>{note}</tr>
//                   )
//                 })}</td> */}
//             </tr>
//           </table>
//         </p>
//         </div>
//         {/* Item list div */}
//         <div className={plantListDiv}><br/>
//           <h1 className='adminSectionTitle'>Plants</h1>
//           <p className='adminSortText'></p>
//           <p className='adminSortText'>{dataSet}</p>
//           <div className='searchDiv adminSortText'>Search by name &nbsp;
//             <input id="searchInput" type="text" onChange = {this.searchFor("name")} />
//           </div>
//           <div className={searchResultsDiv}>
//             <table>
//               {searchResults.map((plant)=>{
//                 return (
//                   <tr>
//                     <td><Link to="" onClick={()=>this.setSearchEntity(plant.id)}>{plant.name}</Link></td>
//                   </tr>
//                 )
//               })}
//             </table>
//           </div>
//           <table className='adminTable'>
//             <tr className='adminRow'>
//               <td></td>
//               <td><Link to="" onClick={()=>{this.sortList(this.state.allPlants, "id")}}>ID</Link></td>
//             </tr>
//             {sortedList.map((plant) =>{
//               return (
//                 <tr className='adminRow'>
//                   <td>
//                     <Link to="" onClick={()=>this.setState({
//                       selectedPlant: plant,
//                       newPlant: plant
//                       })}>Open</Link>
//                   </td>
//                   <td>{plant.id}</td>
//                   <td>{plant.name}</td>
//                   <td>{plant.notes.map((note) => {
//                     return (<tr className='adminSubRow'>{note}</tr>)
//                     })}
//                   </td>
//                   <td>{plant.clone === true ? "Yes" : "No"}</td>
//                 </tr>
//               )
//             })}
//           </table><p>
//           <Link to="" onClick={()=>{
//             this.setState({addPlant: true})
//           }}>Add a plant</Link></p>
//         </div>


//     </div>;
//   }
// }

// export default template;
