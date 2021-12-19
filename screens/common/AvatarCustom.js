import * as React from 'react';
import { Avatar } from 'react-native-elements';


export default function AvatarCustom(props){
console.log("props of avatar , ",props)
 
            
          


        
        
    
  

      
  return (
   

     
          <Avatar
            size={90}
            rounded
            source={{
                uri:
                  props.url,
                 }}
            containerStyle={{ backgroundColor: 'grey' }}
          >
            {/* <Avatar.Accessory size={23} 
            onPress={() => console.log("Works!")}

            /> */}
          </Avatar>

  );
};

   