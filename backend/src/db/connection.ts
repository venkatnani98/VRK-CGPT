import { connect, disconnect} from 'mongoose';


async function connectToDatabase() {
  try{
    await connect(process.env.MONGODB_URL);
  }catch{
    throw new Error("Cannot Connect to MongoDB");
  }
}


async function disconectFromDatabase() {
    try {
        await disconnect();
    } catch (error) {
        throw new Error("Cannot Disconnect from MongoDB");
    }
}

export {connectToDatabase, disconectFromDatabase}