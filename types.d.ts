interface Book {
   id:number,
   title:string,
   author:string,
   genre:string,
   rating:number,
   totalCopies:number,
   availableCopies:number,
   description:string,
   coverColor:string,
   coverUrl:string,
   summary: string,
   isLoanedBook?: boolean
}

interface AuthCredentials {
   fullName: string;
   email: string;
   universityId: number;
   password: string;  
   universityCard: string; 
   
}

