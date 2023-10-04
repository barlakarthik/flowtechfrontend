import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Config } from "../../config";
import { ApplicationContextApi } from "../../AppContext";
const OverlayAssign = (props) => {
  const [Overlays, SetOverlays] = useState([]);
  const [Selected, SetSelected] = useState([]);
  const [InitialState, SetInitialState] = useState({});
  const [DeSelected, SetDeSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);
  const [totalOverlays, setTotalOverlays] = useState(0);
  const [selectValue, setSelectValue] = useState("all");
  const context = useContext(ApplicationContextApi);

  useEffect(() => {
    getAllOverlays();
  }, []);
  const handleSelect = (e) => {
    const { value } = e.target;
    setSelectValue(value);
    // let filttered = Overlays.filter((item) => {
    //   if (
    //     item.hierarchyIds.includes(props.hierarchyItemId) &&
    //     value === "checked"
    //   ) {
    //     return item;
    //   }
    //   if (
    //     !item.hierarchyIds.includes(props.hierarchyItemId) &&
    //     value === "unchecked"
    //   ) {
    //     return item;
    //   }
    // });
    // console.log(filttered);
    // FilteredOverlays = filttered;
  };

  const getAllOverlays = (e) => {
    axios
      .get(
        `${Config.lb4api()}/overlays?filter={"where":{"overlayType":{"neq":"Documents"}}}`
      )
      .then((res) => {
        SetOverlays(res.data);
      })
      .catch((err) => console.error(err));
  };

  let FilteredOverlays = useMemo(() => {
    let arr = Overlays.map((i) => {
      if (i.overlayType.includes("Hyper Link")) {
        return i;
      }
    });
    console.log(arr, "arr");
    let overlays = Overlays;
    switch (selectValue) {
      case "all":
        overlays = Overlays;
        break;
      case "checked":
        overlays = Overlays.filter((i) =>
        i.hierarchyIds.includes(props.hierarchyItemId)
        );
        setCurrentPage(1);
        break;
      case "unchecked":
        overlays = Overlays.filter(
          (i) => !i.hierarchyIds.includes(props.hierarchyItemId)
        );
        break;
      default:
        break;
    }

    if (search) {
      overlays = overlays.filter((overlay) =>
        overlay.overlayName.toLowerCase().includes(search.toLowerCase())
      );
    }
    setTotalOverlays(overlays.length);
    return overlays.slice(
      (currentPage - 1) * postsPerPage,
      (currentPage - 1) * postsPerPage + postsPerPage
    );
  }, [Overlays, currentPage, search, selectValue]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const nPages = Math.ceil(totalOverlays / postsPerPage);
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  useEffect(() => {
    SetSelected(
      [...FilteredOverlays]
        .filter((i) => i.hierarchyIds?.includes(props.hierarchyItemId))
        .map((j) => j.id)
    );
    let initState = {};
    FilteredOverlays.map((i) => {
      if (i.hierarchyIds?.includes(props.hierarchyItemId)) {
        initState[i.id] = true;
      } else {
        initState[i.id] = false;
      }
    });
    SetInitialState(initState);
  }, [FilteredOverlays]);

  const requestCheckBox = (id) => {
    let selections = [...Selected];
    let deselections = [...DeSelected];
    if (selections.includes(id)) {
      let index = selections.indexOf(id);
      if (index !== -1) {
        selections.splice(index, 1);
      }
      deselections.push(id);
    } else {
      let index = deselections.indexOf(id);
      if (index !== -1) {
        deselections.splice(index, 1);
      }
      selections.push(id);
    }
    SetSelected(selections);
    SetDeSelected(deselections);
  };

  const checkboxHandler = (id, overlay, e) => {
    if (overlay.overlayType === "Coordinates") {
      let duplicates = [...FilteredOverlays]
        ?.filter((i) => i.hierarchyIds?.includes(props.hierarchyItemId))
        .map((j) => j.overlayType);
      if (duplicates.includes("Coordinates") && !e.target.checked) {
        context.alertSkeleton({
          title: "ERROR",
          type: "danger",
          message: "Coordinates Already Assigned to this Hierarachy Item",
        });
      } else requestCheckBox(id);
    } else requestCheckBox(id);
  };

  const DeleteOverlayHandler = async (id) => {
    const response = await axios.delete(`${Config.lb4api()}/overlays/${id}`);
    if (response.status === 204) getAllOverlays();
  };

  const AssignSpacesHandler = () => {
    Selected.map((i) => {
      if (!InitialState[i]) {
        let OverlaysData = FilteredOverlays.find((s) => s.id === i);
        axios.patch(`${Config.lb4api()}/overlays/${i}`, {
          ...OverlaysData,
          hierarchyIds: [...OverlaysData?.hierarchyIds, props.hierarchyItemId],
        });
      }
    });
    DeSelected.map((i) => {
      if (InitialState[i]) {
        let OverlaysData = FilteredOverlays.find((s) => s.id === i);
        let index = OverlaysData.hierarchyIds.indexOf(props.hierarchyItemId);
        OverlaysData.hierarchyIds.splice(index, 1);
        axios.patch(`${Config.lb4api()}/overlays/${i}`, {
          ...OverlaysData,
          hierarchyIds: [...OverlaysData?.hierarchyIds],
        });
      }
    });
    props.close();
  };

  return (
    <div>
      <div class="row align-items-start">
        <div className="col-auto">
          <select class="form-select" onChange={handleSelect}>
            <option value="all" selected={selectValue === "all"}>
              All
            </option>
            <option value="checked" selected={selectValue === "checked"}>
              Checked
            </option>
            <option value="unchecked" selected={selectValue === "unchecked"}>
              Unchecked
            </option>
          </select>
        </div>
        <div className="col">
          <input
            className="form-control"
            id="myInput"
            style={{ width: "140px", height: "30px", float: "right" }}
            type="text"
            placeholder="Search.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div>
        {FilteredOverlays?.length !== 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Check Box</th>
                <th scope="col">Overlay Name</th>
                <th scope="col">Overlay Type</th>
                <th scope="col">Overlay Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {FilteredOverlays.map((overlay) => {
                console.log(overlay, "overlay");
                if (overlay.overlayType !== "Documents") {
                  return (
                    <tr>
                      <th scope="row">
                        <div className="form-check">
                          <input
                            class="form-check-input"
                            onClick={(e) =>
                              checkboxHandler(overlay.id, overlay, e)
                            }
                            type="checkbox"
                            id="flexCheckDefault"
                            checked={Selected?.includes(overlay.id)}
                          />
                        </div>
                      </th>
                      <td>{overlay.overlayName}</td>
                      <td>{overlay.overlayType}</td>
                      <td>{overlay.overlayDescription}</td>
                      <td>
                        <i
                          className="fa fa-pencil mx-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => props.editOverlayHandler(overlay.id)}
                        ></i>
                        <i
                          className="fa fa-trash mx-2"
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => DeleteOverlayHandler(overlay.id)}
                        ></i>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        ) : (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Check Box</th>
                  <th scope="col">Overlay Name</th>
                  <th scope="col">Overlay Type</th>
                  <th scope="col">Overlay Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
            </table>
            <center>
              <div>
                <strong className="text-center">No Overlays Found</strong>
              </div>
            </center>
          </div>
        )}
      </div>
      <div className="float-end" style={{ marginRight: "0px" }}>
        {Overlays.length > postsPerPage ? (
          <nav>
            <ul className="pagination cursor-pointer">
              {currentPage !== 1 && (
                <li className="page-item">
                  <a className="page-link" onClick={prevPage}>
                    Prev
                  </a>
                </li>
              )}
              {pageNumbers
                .slice(
                  currentPage >= 3 ? currentPage - 3 : 0,
                  currentPage >= 3 ? currentPage : 3
                )
                .map((number, i) => {
                  return (
                    <li key={i} className="page-item">
                      <a
                        className="page-link"
                        style={
                          currentPage === number
                            ? {
                                background: "rgb(48, 117, 184)",
                                color: "white",
                              }
                            : { background: "rgba(0, 0, 0, 0)" }
                        }
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </a>
                    </li>
                  );
                })}
              {currentPage !== pageNumbers.length && (
                <li className="page-item">
                  <a className="page-link" onClick={nextPage}>
                    Next
                  </a>
                </li>
              )}
            </ul>
          </nav>
        ) : (
          ""
        )}
        <div className="btn btn-primary" onClick={AssignSpacesHandler}>
          Assign
        </div>{" "}
        <div className="btn btn-secondary" onClick={props.close}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default OverlayAssign