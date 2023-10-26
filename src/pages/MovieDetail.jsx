/* eslint-disable eqeqeq */
import React, {useState,useEffect} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import axios from '../axios';

const MovieDetail = () => {
  // useParams
  // Route 작성하는 부분에 /:id <- path 작성
  const { id } = useParams();

  // useSearchParams
  // url 을 작성하는 부분에 ?type = 어쩌구
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  // redux에 있는 데이터 가지고옴
  const { popularMovies, topRatedMovies, upComingMovies } = useSelector(
    (state) => state.movies
  );

  const [movie, setMovie] = useState();
  const [review, setReview] = useState([]);

  // 내가 가져올 영화에 대한 데이터를 추출하는 함수
  const getMovieData = () => {
    if (type === "popularMovies") {
      console.log("인기");
      setMovie(popularMovies.results.find((e) => e.id == id));
    } else if (type === "topRatedMovies") {
      console.log("많이봄");
      setMovie(topRatedMovies.results.find((e) => e.id == id));
    } else if (type === "upComingMovies") {
      console.log("곧개봉");
      setMovie(upComingMovies.results.find((e) => e.id == id));
    }
  };

  const getReviewData = () =>{
    // /{movie_id}/reviews
    axios.get(`/${id}/reviews`).then(res=>setReview(res.data.results))
  }

  useEffect(() => {
    if (movie) {
      sessionStorage.setItem("movie", JSON.stringify(movie));
    }
  }, [movie]);

  // 세션 안에 값이 가지고 와졌을때,
  useEffect(() => {
    const sessionMovie = JSON.parse(sessionStorage.getItem('movie'))
    // 세션 안에 값이 존재하면 (이미 클릭한 전적) => 세션안에 있는 값을 movie 세팅
    if(sessionMovie &&sessionMovie.id == id){
      setMovie(sessionMovie)
    } else{
      // 세션 안에 값이 없다면 (최초클릭) => redux로 가서 movie 세팅
      getMovieData();
    }
    getReviewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    popularMovies.results,
    topRatedMovies.results,
    upComingMovies.results,
    id,
    type,
  ]);

  return (
    <div className="movie-detail">
      {movie && (
        <div className="movie-box">
          <div
            className="detail-poster"
            style={{
              backgroundImage: `url(https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path})`,
            }}
          ></div>
          <br />
          <div className="detail-item">
            <div>
              {movie.adult ? (
                <Badge bg="danger">청소년 관람 불가</Badge>
              ) : (
                <Badge bg="success">전체관람가</Badge>
              )}
            </div>
            <h1>{movie.title}</h1>
            <div>
              <span>평점 : {movie.vote_average}점</span>
              <span>개봉일 : {movie.release_date}</span>
            </div>
            <br />
            <div>{movie.overview}</div>
            
            <hr />
            <h2>Review</h2>
            {review.length >0? (review.map(item=>
                <div key={item.id}>
                  <p>{item.content}</p>
                  <p>
                    작성자: {item.author} | 
                    작성일: {item.updated_at}
                  </p>
                  <hr />
                </div>)):<p>등록된 리뷰가 없습니다!</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail
