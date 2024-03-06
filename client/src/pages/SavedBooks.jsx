import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_GET_ME } from '../utils/queries';

const SavedBooks = () => {
  const token = Auth.getToken()
  const user = Auth.getProfile(token)
  const { loading, data } = useQuery(QUERY_GET_ME, {
    variables: {_id: user.data._id}
  })
  const [removeBook, {error}] = useMutation(REMOVE_BOOK);
  //save user's info to a constant. If there is no data then return an empty object
  const userData = data?.me || {};
  //define a length based on data a user has
  const userDataLength = Object.keys(userData).length;

  const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        try {
          const {data} = await removeBook({
            variables: {
              userId: userData._id,
              bookId: bookId
            },
          });
        
        removeBookId(bookId);
        //reload window to update view
        window.location.reload();
        //display error if try fails
      } catch (err) {
          console.error(err);
      }
    };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
