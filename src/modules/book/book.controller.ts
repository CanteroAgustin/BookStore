import {
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  ParseIntPipe,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ReadBookDto, CreateBookDto, UpdateBookDto } from './dtos';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDto> {
    return this._bookService.get(id);
  }

  @Get(':author/:authorId')
  getBookdByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBooksByAuthor(authorId);
  }

  @Get()
  getRoles(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() role: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(role);
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBookByAuthor(
    @Body() role: Partial<CreateBookDto>,
    @GetUser('id') authorId: number
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(role, authorId);
  }

  @Patch(':id')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateBookDto>,
    @GetUser('id') authorId: number
  ) {
    return this._bookService.update(id, role, authorId);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._bookService.delete(id);
  }
}
