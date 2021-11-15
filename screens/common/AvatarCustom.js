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
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                 }}
            containerStyle={{ backgroundColor: 'grey' }}
          >
            <Avatar.Accessory size={23} 
            onPress={() => console.log("Works!")}

            />
          </Avatar>

  );
};

   