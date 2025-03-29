import { bookSliceActions } from "@/store/BooksSlice/BooksSlice";
import { AppDispatch } from "@/store/store";
import { Book } from "@/types/BookTypes";
import axios from "axios";

const BASE_URL = "/designer/books";

interface type_book_response {
  data: Book[];
  success: boolean;
}

export function fetchAllUsersBooks(dispatch: AppDispatch, userId: string) {
    let filter = { where: {userId: userId}, sortBy: "updateDate DESC"}
    return axios<type_book_response>({
        url: `${BASE_URL}?filter=${encodeURIComponent(JSON.stringify(filter))}`,
        method: "GET",
    }).then((response) => {
        const { data, success } = response.data;
        if(success){
            dispatch(bookSliceActions.fetchUserBooks(data));
        } else {
            throw response.data;  
        }
    }).catch((error) => {
        throw new Error(error);
    });
}

export function fetchCertificate(bookId: string) {
    return axios({
        url: `${BASE_URL}/downloadCertificate/${bookId}`,
        responseType: "blob"
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        throw new Error(error);
    })
}