# AnimalWatch
Dynamic data logging web app for ecologists

## Initial Development Stage 
This project is consistantly adapting and readapting to new ideas and limitations.
### Backend
In its current state, the site consists of a django rest 
framework operating the backend with a temporary SQLite database set up. The data structure is as follows:
![text](https://github.com/SamTabbutt/AnimalWatch/blob/master/misc/DataStruct.jpg)

The data is stored for the purpose of training a machine learning model to categorize the behavior of wild animals. The logging sytem in place exists to make that an option for the application as it is scaled. 

### Frontend
