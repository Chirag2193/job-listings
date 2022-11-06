import { useEffect, useReducer } from "react"
import Card from "../components/Card";
import styles from "../styles/Home.module.css"

const initialState = {
  displayResults: [],
  applied_filters: [],
  results: []
};

const compareArrays = (left, right) => {
  const flag = [...right].every((rightItem) => left.includes(rightItem));
  return flag;
}

const ListingReducer = (state, action) => {
  const clonedState = { ...state };
  
  switch (action.type) {
    case 'ADD_LISTINGS':
      clonedState['displayResults'] = [...action.payload.results];
      clonedState['results'] = [...action.payload.results];

      return clonedState;

    case 'APPLY_FILTER':
      clonedState['applied_filters'] = [...clonedState['applied_filters'], action.payload.slice()];
      clonedState['displayResults'] = [...clonedState['results']]
      .filter((listing) => compareArrays(listing.languages, clonedState.applied_filters) );
     
      return clonedState;

    case 'REMOVE_FILTER':
      clonedState['applied_filters'] = clonedState['applied_filters'].filter((filter) => filter !==  action.payload.slice());
      clonedState['displayResults'] = [...clonedState['results']]
      .filter((listing) => compareArrays(listing['languages'], clonedState['applied_filters']) );

      return clonedState;
  
    default:
      throw new Error();
  }
}

const handleFilter = (ev, language, dispatch) => {
  ev.preventDefault();
  dispatch({
    type: "APPLY_FILTER",
    payload: language
  })
}

const handleRemoveFilter = (ev, filter, dispatch) => {
  ev.preventDefault();
  dispatch({
    type: "REMOVE_FILTER",
    payload: filter
  })
}

const Left = (listing) => {
  return (
  <div className={styles["job-info"]}>
    <span>{listing.position}</span>
    <span>{listing.company}</span>
  </div>)
}

const Right = (languages, dispatch) => {
  return (
    <div className={styles["languages"]}>
      {languages.map((language, idx) => {
        return <span className={styles["pill"]} onClick={(ev) => handleFilter(ev, language, dispatch)} key={idx}>{language}</span>
      })} 
    </div>)
}

export default function Home() {
  const [listings, dispatch] = useReducer(ListingReducer, initialState);

  useEffect(() => {
    fetch('/api/job-listings')
    .then((res) => res.json())
    .then((jobs) => {
      dispatch({
        type: "ADD_LISTINGS",
        payload: {
          results: [...jobs]
        }
      })
    }).catch((err) => console.log('Something went wrong', err));

  }, []);

  return (
    <>
      <div className="applied-filters">
        {listings.applied_filters.map((filter, idx) => {
          return (<span key={idx}>
            <span>{filter}</span>
            <i onClick={(ev) => handleRemoveFilter(ev, filter, dispatch)} className="pi pi-times"></i>
          </span>)
        })}
      </div>
     {listings.displayResults && listings.displayResults.length > 0 ? 
      <>
        {listings.displayResults
        .map(listing => <Card key={listing.id} left={() => Left(listing)} right={() => Right(listing.languages, dispatch)} /> )}
      </>
     : null }
    </>
  )
}