import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose";
import {
  Field,
  ObjectType,
  Resolver,
  Query,
  buildSchemaSync,
  Mutation,
  InputType,
  Arg,
} from "type-graphql";
import { Length } from "class-validator";

@ObjectType("BookType")
@InputType("BookInput")
class Book {
  @prop()
  @Field()
  title!: String;

  @prop()
  @Field()
  @Length(5, 255)
  author!: String;
}

const bookModel = getModelForClass(Book);

@Resolver(Book)
class BookResolver {
  // {books{title}}
  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return await bookModel.find();
  }

  // mutation{bookCreate(data:{title:"this is the title", author:"this is the author"}){title, author}}
  @Mutation(() => Book)
  async bookCreate(@Arg("data") newBookData: Book): Promise<Book> {
    return await bookModel.create(newBookData);
  }
}

const schema = buildSchemaSync({
  resolvers: [BookResolver],
});

const server = new ApolloServer({ schema });

(async () => {
  console.log("Connecting to MongoDB");
  await mongoose.connect("mongodb://db:27017/books", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("Connected to mongo");

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
