import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto'

describe('App end-to-end test', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )

    await app.init()
    app.listen(3333)
    prisma = app.get(PrismaService)
    pactum.request.setBaseUrl('http://localhost:3333')
    await prisma.cleanDb()
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ben@gmail.com',
      password: '93838fhdf',
    }
    describe('Signup', () => {
      it('should throw error for empty email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw error for empty password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw error for no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      })

      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
    })
    describe('Signin', () => {
      it('should throw error for empty email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw error for empty password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw error for no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      })

      it('should login a user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('user_access_token', 'access_token')
      })
    })
  })
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{user_access_token}',
          })
          .expectStatus(200)
          .stores('user_access_token', 'access_token')
      })
    })
    describe('Edit user', () => {})
  })

  describe('Bookmark', () => {
    describe('Get bookmark', () => {})
    describe('Create bookmark', () => {})
    describe('Get bookmark by id', () => {})
    describe('Edit bookmark', () => {})
    describe('Delete bookmark', () => {})
  })
})
