import React, { useEffect, useState } from "react";
import axios from "../axios";
import {useDispatch, useSelector} from 'react-redux';
import Banner from "../components/Banner";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUPComingMovies
} from '../redux/movieSlice'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import MovieSlide from "../components/MovieSlide";

const Home = () => {

  const dispatch = useDispatch();
  const { popularMovies, topRatedMovies, upComingMovies } = useSelector(
    (state) => state.movies
  );
  const [loading, setLoading] = useState(true);

  /* 화면이 렌더링 되자마자, API를 가져올 것 */
  useEffect(() => {
    const popularApi = axios.get("/popular?language=ko-KR&page=1");
    const topRatedApi = axios.get("/top_rated?language=ko-KR&page=1");
    const upComingApi = axios.get("/upcoming?language=ko-KR&page=1");

    // Promise.all을 사용하여 여러 번의 API요청을 병렬로 처리
    Promise.all([popularApi, topRatedApi, upComingApi]).then((res) => {
      // API 에서 받아온 데이터를 store 안에 넣고싶음! => useDispach
      dispatch(getPopularMovies(res[0].data));
      dispatch(getTopRatedMovies(res[1].data));
      dispatch(getUPComingMovies(res[2].data));
    })
    .then(()=>{
      setLoading(false);
    })
  }, [dispatch]);

  // store에 값이 잘 들어갔는지 확인해보는 용도
  // useEffect(()=>{
  //   console.log('store상태: ',popularMovies,topRatedMovies,upComingMovies);
  // },[popularMovies,topRatedMovies,upComingMovies]);

  if(loading){
    return (
      <div className="loading-bar">
        <ClimbingBoxLoader
          color="#ffffff"
          loading={loading}
          size={18}
        ></ClimbingBoxLoader>
      </div>
    );
  }
  return (
    <div>
      {/* LifeCycle 생명주기 컴포넌트
      - popularMovies 라는 얘가 존재하면 result
      - 존재하지않는다면 배너 띄울 필요 X
      */}
      {/* {popularMovies.results && ( */}
      <Banner movie={popularMovies.results[0]}></Banner>
      {/* )} */}

      <p>Popular Movies</p>
      {/* 카드슬라이드 */}
      <MovieSlide movies={popularMovies} type="popularMovies"></MovieSlide>

      <p>TopRated Movies</p>
      {/* 카드슬라이드 */}
      <MovieSlide movies={topRatedMovies} type="topRatedMovies"></MovieSlide>

      <p>UpComing Movies</p>
      {/* 카드슬라이드 */}
      <MovieSlide movies={upComingMovies} type="upComingMovies"></MovieSlide>
    </div>
  );
};

export default Home;
