import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);

  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log('movieId:', movieId);
      console.log('token:', token);

      const response = await axios.post(
        'https://hw4-5wny.onrender.com/reviews',
        {
          movieId: movieId,
          rating: Number(rating),
          review: review
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      console.log(response.data);

      setMessage('Review submitted successfully.');
      setRating('');
      setReview('');
      dispatch(fetchMovie(movieId));
    } catch (err) {
      console.log('POST REVIEW ERROR:', err.response ? err.response.data : err.message);
      setMessage('Failed to submit review.');
    }
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div>No movie data available.</div>;
  }

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>

      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>

      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>

        <ListGroupItem>
          {selectedMovie.actors?.map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>

        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating}
          </h4>
        </ListGroupItem>
      </ListGroup>

      <Card.Body className="card-body bg-white">
        {selectedMovie.reviews?.map((reviewItem, i) => (
          <p key={i}>
            <b>{reviewItem.username}</b>&nbsp; {reviewItem.review} &nbsp;
            <BsStarFill /> {reviewItem.rating}
          </p>
        ))}
      </Card.Body>

      <Card.Body className="card-body bg-white">
        <h4>Add Review</h4>
        <Form onSubmit={handleReviewSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Submit Review
          </Button>
        </Form>

        {message && <p className="mt-3">{message}</p>}
      </Card.Body>
    </Card>
  );
};

export default MovieDetail;