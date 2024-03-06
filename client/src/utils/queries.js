import { gql } from "@apollo/client";

export const QUERY_GET_ME = gql`
    query me ($_id: ID!) {
        me(userId: $_id){
            _id
            email
            savedBooks {
                authors
                bookId
                description
                image
                link
                title
            }
            username
        }
    }
`;


