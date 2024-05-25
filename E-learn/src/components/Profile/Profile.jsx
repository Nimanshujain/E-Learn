import { Avatar, 
    Button, 
    Container, 
    HStack, 
    Heading, 
    Image, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    Stack, 
    Text, 
    VStack, 
    useDisclosure
} from '@chakra-ui/react';
import React, { useState } from 'react'
import { RiDeleteBack2Fill } from 'react-icons/ri';
import {  Link } from 'react-router-dom';
import { fileUploadCss } from '../Auth/Register';

const Profile = () => {

    const user ={
        name :"Kunal kumar",
        email :"kunal@gmail.com",
        createdAt: String(new Date().toISOString()),
        role :"user",
        subscription:{
            status: "active",
        },
        playlist:[
            {
                course: 'couses of playlist',
                poster: 'https://cdn.pixabay.com/photo/2017/02/05/00/19/web-design-2038872_1280.jpg',
            },
        ],
    };

    const removeFromPlaylistHandler = id => {
        console.log(id);
    };
    const changeImageSubmitHandler = (e, image) =>{
        
    };

    const {isOpen, onclose, onOpen}=useDisclosure()

  return <Container minH={'95vh'} maxW="container.lg" py="8" >
    <Heading children="Profile" m="8" textTransform={'uppercase'} />

    <Stack
    justifyContent={'flex-start'}
    direction={["column","row"]}
    alignItems={'center'}
    spacing={['8','16']}
    padding="8"
    >
        <VStack>
            <Avatar boxSize={'48'}/>
            <Button onClick={onOpen} colorScheme={'yellow'} variant="ghost">
                Change Photo
            </Button>
        </VStack>
        <VStack spacing={'4'} alignContent={["center","flex-start"]} >
            <HStack>
                <Text children="Name" fontWeight={'bold'} />
                <Text children={user.name} />
            </HStack>
            <HStack>
                <Text children="Email" fontWeight={'bold'} />
                <Text children={user.email} />
            </HStack>
            <HStack>
                <Text children="CreatedAt" fontWeight={'bold'} />
                <Text children={user.createdAt.split("T")[0]} />
            </HStack>

            {user.role !== 'admin' && (
            <HStack>
              <Text children="Subscription" fontWeight={'bold'} />
              {user.subscription && user.subscription.status === 'active' ? (
                <Button
                  color={'yellow.500'}
                  variant="unstyled"
                 >
                  Cancel Subscription
                </Button>
              ) : (
                <Link to="/subscribe">
                  <Button colorScheme={'yellow'}>Subscribe</Button>
                </Link>
              )}
            </HStack>
                )
            }
            <Stack direction={['column', 'row']} alignItems={'center'}>
            <Link to="/updateprofile">
              <Button>Update Profile</Button>
            </Link>

            <Link to="/changepassword">
              <Button>Change Password</Button>
            </Link>
          </Stack>

        </VStack>

    </Stack>
    <Heading children="Playlist" size={'md'} my="8" />

    {user.playlist.length > 0 && (
        <Stack
          direction={['column', 'row']}
          alignItems={'center'}
          flexWrap="wrap"
          p="4"
        >
          {user.playlist.map(element => (
            <VStack w="48" m="2" key={element.course}>
              <Image
                boxSize={'full'}
                objectFit="contain"
                src={element.poster}
              />

              <HStack>
                <Link to={`/course/${element.course}`}>
                  <Button variant={'ghost'} colorScheme="yellow">
                    Watch Now
                  </Button>
                </Link>

                <Button
                  onClick={() => removeFromPlaylistHandler(element.course)}
                >
                  <RiDeleteBack2Fill />
                </Button>
              </HStack>
            </VStack>
          ))}
        </Stack>
    )}
    <ChangePhotoBox 
    changeImageSubmitHandler ={changeImageSubmitHandler}
    isOpen={isOpen} onclose={onclose}/>
  </Container>
}

export default Profile ;

function ChangePhotoBox({isOpen,onClose,changeImageSubmitHandler}){
    const [image,setImage] = useState("")
    const [imagePrev,setImagePrev] = useState("")


    const changeImage = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
    
        reader.onloadend = () => {
          setImagePrev(reader.result);
          setImage(file);
        };
      };

      const closeHandler =()=>{
        onclose();
        setImagePrev("");
        setImage("");
      }

      return (
        <Modal isOpen={isOpen} onClose={closeHandler}>
          <ModalOverlay backdropFilter={'blur(10px)'} />
          <ModalContent>
            <ModalHeader>Change Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Container>
                <form onSubmit={(e) => changeImageSubmitHandler(e, image)}>
                  <VStack spacing={'8'}>
                    {imagePrev && <Avatar src={imagePrev} boxSize={'48'} />}
    
                    <Input
                      type={'file'}
                      css={{ '&::file-selector-button': fileUploadCss }}
                      onChange={changeImage}
                    />
    
                    <Button
                      w="full"
                      colorScheme={'yellow'}
                      type="submit"
                    >
                      Change
                    </Button>
                  </VStack>
                </form>
              </Container>
            </ModalBody>
    
            <ModalFooter>
              <Button mr="3" onClick={closeHandler}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }