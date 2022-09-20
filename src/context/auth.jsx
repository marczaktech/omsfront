import { createContext, useEffect, useState } from "react"
import fetchUsers from '../services/userData'

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const {data: getAll, isLoading: loadAll } = fetchUsers()
  
  useEffect(() => {
    if(!loadAll){
      const userToken = localStorage.getItem("user_token");
      
      if (userToken) {
        const emailToken = JSON.parse(userToken).email
        
        const data = getAll?.filter((user) => {
          if(user.email === emailToken){
            return (user)
          }
        })

        let emailUser = data[0].email
        let idUser =  data[0].id
        let privilegeUser = data[0].privilege

        setUser({emailUser, idUser, privilegeUser})
      }
    }
  }, [getAll]);
  

  const signin = (email, id, privilege) => {
    const token = Math.random().toString(36).substring(2);

    localStorage.setItem("user_token", JSON.stringify({ email, token }));

    let emailUser = email
    let idUser = id
    let privilegeUser = privilege

    setUser({emailUser, idUser, privilegeUser})

    return;

  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
