import { Operation } from './operation';


export class BaseCrudInterfaceImpl {
  serviceIntf: string = 'BaseDtoCrudService';
  serviceIntfParametrized: string;
  intfFunctionName: string;
  isCrud: boolean;

  methodName: string;
  paramsType: string;
  operation: Operation;
  functionResultType: string;
  rawDtoType: string;
  // Will cause serviceIntf to be parametrized with raw dto detected in this operation
  isLeading: boolean;

  private readonly arrayRegexp = /^Array<([^<>]+)>$/;

  constructor(operation: Operation, resultType: string, methodName: string, paramsType: string) {
    switch (operation.spec.description) {
      case 'baseCreate':
        this.intfFunctionName = 'create';
        this.isLeading = true;
        break;
      case 'baseUpdate':
        this.intfFunctionName = 'update';
        break;
      case 'baseDeleteById':
        this.intfFunctionName = 'delete';
        break;
      case 'baseGetAll':
        this.intfFunctionName = 'getAll';
        break;
      case 'baseGetById':
        this.intfFunctionName = 'getById';
        break;
      case 'baseGetByPage':
        this.intfFunctionName = 'getByPage';
        break;
      case 'baseGetBySpecPageExtended':
        this.intfFunctionName = 'getBySpecPageExtended';
        break;
      default:
        this.isCrud = false;
        return;
    }

    // Strip result type if array
    if (this.arrayRegexp.test(resultType)) {
      this.rawDtoType = resultType.replace(this.arrayRegexp, '$1');
    } else {
      this.rawDtoType = resultType;
    }

    // Parametrize
    if (this.isLeading) {
      this.serviceIntfParametrized = this.serviceIntf + '<' + this.rawDtoType + '>';
    }

    this.isCrud = true;
    this.methodName = methodName;
    this.operation = operation;
    this.paramsType = paramsType;
    this.functionResultType = resultType;
  }

}
